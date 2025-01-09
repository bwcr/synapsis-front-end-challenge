/* eslint-disable react-hooks/exhaustive-deps */
import type { Post, PostsResponse } from "@/pages/api/posts";
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import { Card, Dropdown, Button, Typography, notification, Modal } from "antd";
import Link from "next/link";
import { EllipsisOutlined } from "@ant-design/icons";
import { useRef, useCallback } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";
export default function PostListCard({
  post,
  posts,
  index,
  query,
}: {
  post: Post;
  posts: Post[];
  index: number;
  query: UseInfiniteQueryResult<InfiniteData<PostsResponse, unknown>, Error>;
}) {
  const { status, mutateAsync, error } = useMutation({
    mutationKey: ["post-delete", post.id],
    mutationFn: async () => {
      const response = await axios.delete(`/api/posts/${post.id}`);
      return response.data;
    },
  });

  const queryClient = new QueryClient();

  const onDelete = async () => {
    Modal.confirm({
      title: "Delete Post",
      content: "Are you sure you want to delete this post?",
      onOk: async () => {
        try {
          await mutateAsync();
          notification.success({ message: "Post deleted" });
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        } catch (error) {
          notification.error({ message: "Failed to delete post" });
          console.error(error);
        }
      },
    });
  };

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  const observer = useRef<IntersectionObserver>();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const lastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (node && isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, []);
  return (
    <Card
      test-id="post-list-card"
      hoverable
      title={post.title}
      loading={status === "pending"}
      className="w-full h-full flex flex-col"
      ref={posts.length === index + 1 ? lastPostRef : null}
      extra={
        post.editable ? (
          <Dropdown
            className="post-list-card-dropdown"
            menu={{
              items: [
                {
                  key: "edit",
                  label: <Link href={`/posts/${post.id}/edit`}>Edit</Link>,
                },
                {
                  key: "delete",
                  onClick: onDelete,
                  label: "Delete",
                },
              ],
            }}
          >
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        ) : null
      }
      key={post.id}
      styles={{
        body: {
          gap: "1rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      <Typography.Paragraph>{post.body}</Typography.Paragraph>
      <Link passHref href={`/posts/${post.id}`} className="mt-auto">
        <Button size="small" className="p-0" type="link">
          View Details
        </Button>
      </Link>
    </Card>
  );
}
