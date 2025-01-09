import PostList from "@/components/post/post-list";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Breadcrumb, Card, Typography, Skeleton, Avatar, Flex } from "antd";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import type { UserResponse } from "@/pages/api/users/[id]";

export default function Page() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const query = useInfiniteQuery({
    queryKey: ["profile-posts", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios(
        `api/users/posts/me?page=${pageParam}&search=${search}`
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.meta.pagination.page < lastPage.meta.pagination.pages) {
        return (lastPageParam as number) + 1;
      }
    },
  });
  const me = useQuery<UserResponse>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/api/users/me");
      return res.data;
    },
  });
  return (
    <Flex vertical gap="small" className="w-full">
      <Breadcrumb
        items={[{ title: <Link href="/">Posts</Link> }, { title: "Profile" }]}
      />
      {/* Add user profile card */}
      <Card className="w-full text-center">
        <Skeleton loading={me.isPending} active>
          <Avatar />
          <Typography.Title level={1}>{me.data?.data.name}</Typography.Title>
          <Typography.Text>{me.data?.data.email}</Typography.Text>
        </Skeleton>
      </Card>
      <PostList
        query={query}
        search={search}
        setSearch={setSearch}
        debouncedSearch={debouncedSearch}
      />
    </Flex>
  );
}
