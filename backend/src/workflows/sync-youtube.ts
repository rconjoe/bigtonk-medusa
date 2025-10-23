import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import YoutubeModuleService from "../modules/youtube/service";
import { YOUTUBE_MODULE } from "../modules/youtube";
import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "../lib/constants";
import { google } from "googleapis";

export type FetchVideosStepInput = {
  maxRecentVideos: number;
  maxRecentShorts: number;
};

export type WriteVideosStepInput = Array<{
  videoid: string;
  title: string;
  thumbnail: string;
  order: number;
  type: "video" | "short";
}>;

// --- Helper to convert ISO 8601 duration to seconds ---
function parseYouTubeDuration(isoDuration: string): number {
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

const fetchVideosStep = createStep(
  "fetch-videos",
  async (youtubeInput: FetchVideosStepInput) => {
    console.log(`[${new Date().toISOString()}] Starting Youtube data sync...`);
    const youtube = google.youtube({
      version: "v3",
      auth: YOUTUBE_API_KEY,
    });

    const maxResults =
      youtubeInput.maxRecentVideos + youtubeInput.maxRecentShorts;

    // 1. get channel "uploads" playlist ID
    const channelRes = await youtube.channels.list({
      id: [YOUTUBE_CHANNEL_ID],
      part: ["contentDetails"],
    });

    const uploadsPlaylistId =
      channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      console.error("Could not find uploads playlist for the channel.");
      return;
    }
    console.log(`Found uploads playlist ID: ${uploadsPlaylistId}`);

    //2. Fetch recent videos from that playlist
    const playlistItemsRes = await youtube.playlistItems.list({
      playlistId: uploadsPlaylistId,
      part: ["snippet"],
      maxResults: maxResults + 10,
      fields:
        "items(snippet(resourceId(videoId),title,thumbnails(high(url)),publishedAt))",
    });

    const videoIds =
      playlistItemsRes.data.items?.map(
        (item) => item.snippet?.resourceId?.videoId,
      ) || [];

    if (videoIds.length === 0) {
      console.log("No videos found in the uploads playlist.");
      return;
    }

    // 3. get content details for each video
    const videoDetailsRes = await youtube.videos.list({
      // @ts-ignore
      id: videoIds.join(","),
      part: ["snippet", "contentDetails"],
      fields:
        "items(id,snippet(title,thumbnails(high(url)),publishedAt),contentDetails(duration))",
    });

    const allUploadedVideos: Array<{
      videoId: string;
      title: string;
      thumbnailUrl: string;
      publishedAt: Date;
      durationSeconds: number;
    }> = [];

    // @ts-ignore
    for (const item of videoDetailsRes.data.items || []) {
      const videoId = item.id;
      const title = item.snippet?.title;
      const thumbnailUrl = item.snippet?.thumbnails?.high?.url;
      const publishedAt = item.snippet?.publishedAt
        ? new Date(item.snippet.publishedAt)
        : null;
      const duration = item.contentDetails?.duration;

      if (videoId && title && thumbnailUrl && publishedAt && duration) {
        allUploadedVideos.push({
          videoId,
          title,
          thumbnailUrl,
          publishedAt,
          durationSeconds: parseYouTubeDuration(duration),
        });
      }
    }

    allUploadedVideos.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );

    const shorts: typeof allUploadedVideos = [];
    const videos: typeof allUploadedVideos = [];

    // Separate shorts and videos and apply limits
    for (const video of allUploadedVideos) {
      if (
        video.durationSeconds < 180 &&
        shorts.length < youtubeInput.maxRecentShorts
      ) {
        shorts.push(video);
      } else if (
        video.durationSeconds >= 180 && // <--- Add this condition
        videos.length < youtubeInput.maxRecentVideos
      ) {
        videos.push(video);
      }
      // If both lists are full, we can stop processing further
      if (
        shorts.length === youtubeInput.maxRecentShorts &&
        videos.length === youtubeInput.maxRecentVideos
      ) {
        break;
      }
    }

    console.log(shorts);
    console.log(videos);

    // Assign 'order' based on their sorted position (1-indexed)
    const recentShortsWithOrder = shorts.map((s, index) => ({
      videoid: s.videoId,
      title: s.title,
      thumbnail: s.thumbnailUrl,
      order: index + 1,
      type: "short",
    }));

    const recentVideosWithOrder = videos.map((v, index) => ({
      videoid: v.videoId,
      title: v.title,
      thumbnail: v.thumbnailUrl,
      order: index + 1,
      type: "video",
    }));

    console.log(
      `Prepared ${recentVideosWithOrder.length} recent videos with order.`,
    );
    console.log(
      `Prepared ${recentShortsWithOrder.length} recent shorts with order.`,
    );

    const allVideos = recentVideosWithOrder.concat(recentShortsWithOrder);

    return new StepResponse(allVideos, allVideos);
  },
);

const deleteVideosStep = createStep(
  "delete-videos",
  async (_, { container }) => {
    const youtubeModuleService: YoutubeModuleService =
      container.resolve(YOUTUBE_MODULE);

    // @ts-ignore
    const allVideos = await youtubeModuleService.listVideos();
    const allVideoIds = allVideos.map((x) => x.id);
    // @ts-ignore
    await youtubeModuleService.deleteVideos(allVideoIds);

    return new StepResponse();
  },
);

const writeVideosStep = createStep(
  "write-videos",
  async (writeVideosInput: WriteVideosStepInput, { container }) => {
    const youtubeModuleService: YoutubeModuleService =
      container.resolve(YOUTUBE_MODULE);

    // @ts-ignore
    const videos = await youtubeModuleService.createVideos(writeVideosInput);

    return new StepResponse(videos);
  },
);

export const syncYoutubeWorkflow = createWorkflow("sync-youtube", () => {
  const allVideos = fetchVideosStep({
    maxRecentShorts: 8,
    maxRecentVideos: 4,
  });
  deleteVideosStep();
  // @ts-ignore
  const videos = writeVideosStep(allVideos);

  return new WorkflowResponse(videos);
});
