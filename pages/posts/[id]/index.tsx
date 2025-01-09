import PostDetail from "@/components/post/post-detail";
import React from "react";
import { useRouter } from "next/router";
export default function Page() {
  const { query: params } = useRouter();
  if (!params.id) return null;
  return <PostDetail id={params.id} />;
}
