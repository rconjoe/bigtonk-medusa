import React, { useEffect } from "react";

import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Link } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import YoutubeVideoViewer from "../../components/YoutubeViewer";

const YoutubePage = () => {
  return (
    <Container className="divide-y p-0">
      <YoutubeVideoViewer />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Youtube",
  icon: Link,
});

export const handle = {
  breadcrumb: () => "Youtube",
};

export default YoutubePage;
