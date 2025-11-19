// app/client/[projectName]/page.jsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChatLayout from "@/components/Chat/ChatLayout";

export default function ClientChatPage() {
  const { projectName } = useParams();

  // projectName will be slug like "e-commerce-product-page"
  // Pass it to ChatLayout as the selected project
  return <ChatLayout projectSlug={projectName} />;
}
