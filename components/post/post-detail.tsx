import type { Post } from "@/pages/api/posts";
import { Flex, Breadcrumb, Skeleton, Typography, Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { PostResponse } from "@/pages/api/posts/[id]";
import { useRouter } from "next/router";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import type { User } from "@/pages/api/login";
export default function PostDetail({ id }: { id: string | string[] }) {
  const router = useRouter();
  const { data, isPending, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await axios<PostResponse>(`/api/posts/${id}`);
      const author = await axios<User>(`/api/users/${res.data.data.user_id}`);
      console.log("🚀 ~ queryFn: ~ author:", author);
      return { data: { ...res.data.data, author: author.data } };
    },
  });
  const post = data?.data;
  console.log("🚀 ~ PostDetail ~ post:", post);

  if (isError)
    return (
      <Typography.Text type="danger">{"Error loading post"}</Typography.Text>
    );

  return (
    <Flex vertical gap="small" className="w-full">
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/" passHref>
                Posts
              </Link>
            ),
          },
          {
            title: post?.title,
          },
        ]}
      />
      <Card
        className="w-full post-detail"
        styles={{
          body: { gap: "1rem", display: "flex", flexDirection: "column" },
        }}
      >
        <Skeleton loading={isPending} active>
          <Typography.Title level={1}>{post?.title}</Typography.Title>
          <Flex gap="small">
            <UserOutlined />
            <Typography.Text className="font-medium">
              {post?.author.name}
            </Typography.Text>
          </Flex>
          <Typography.Text>{post?.body}</Typography.Text>
        </Skeleton>
      </Card>
    </Flex>
  );
}
