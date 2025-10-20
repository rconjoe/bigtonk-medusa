import React, { useEffect } from "react";

import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Link } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import { sdk } from "../../../lib/sdk.js";
import ItemEditor from "../../components/ItemEditor";

const LinktreePage = () => {
  useEffect(() => {
    sdk.client.fetch("/linktree/linkrow").then((data) => {
      console.log(data.linkrows);
    });
  }, []);

  return (
    <Container className="divide-y p-0">
      <ItemEditor />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Linktree",
  icon: Link,
});

export const handle = {
  breadcrumb: () => "Linktree",
};

export default LinktreePage;
