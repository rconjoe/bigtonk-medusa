import React, { useState, useEffect } from "react";
import { Container, Table, Text, Badge, Button } from "@medusajs/ui";
import { Spinner } from "@medusajs/icons";
import { sdk } from "../lib/sdk.js";

interface YoutubeVideo {
  id: string;
  videoid: string;
  title: string;
  thumbnail: string;
  order: number;
  type: "video" | "short";
}

const YoutubeVideoViewer: React.FC = () => {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false); // New state for sync button loading

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        videos: { data },
      } = await sdk.client.fetch("/youtube");
      console.log(data);
      setVideos(data || []);
    } catch (err) {
      console.error("Failed to fetch YouTube videos:", err);
      setError("Failed to fetch YouTube videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncClick = async () => {
    setSyncing(true); // Start syncing loading state
    setError(null); // Clear any previous errors
    try {
      // Send a blank POST request to /youtube
      await sdk.client.fetch("/youtube", {
        method: "POST",
        body: {}, // A blank body for a simple trigger POST
      });
      // If successful, re-fetch videos to update the table
      await fetchVideos();
      alert("YouTube videos synchronized successfully!");
    } catch (err) {
      console.error("Failed to synchronize YouTube videos:", err);
      setError("Failed to synchronize YouTube videos. Please try again.");
      alert(
        "Synchronization failed. Please refresh the page manually to check for inconsistencies.",
      );
    } finally {
      setSyncing(false); // End syncing loading state
    }
  };

  return (
    <Container className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <Text className="text-xl font-semibold">YouTube Videos</Text>
        <Button onClick={handleSyncClick} disabled={syncing || loading}>
          {syncing ? <Spinner /> : null}
          Sync Videos
        </Button>
      </div>

      {loading && <Text>Loading YouTube videos...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}

      {!loading && !error && videos.length === 0 ? (
        <Text>No YouTube videos to display.</Text>
      ) : (
        !loading &&
        !error && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Thumbnail</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Video ID</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Order</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {videos.map((video) => (
                <Table.Row key={video.id} className="hover:bg-ui-bg-base-hover">
                  <Table.Cell>
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={`Thumbnail for ${video.title}`}
                        className="h-16 w-28 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-28 bg-ui-bg-base flex items-center justify-center rounded">
                        <Text className="text-ui-fg-muted text-xs">
                          No Thumbnail
                        </Text>
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ui-fg-interactive hover:underline"
                    >
                      {video.title}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{video.videoid}</Table.Cell>
                  <Table.Cell>
                    <Badge color={video.type === "video" ? "blue" : "purple"}>
                      {video.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{video.order}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )
      )}
    </Container>
  );
};

export default YoutubeVideoViewer;
