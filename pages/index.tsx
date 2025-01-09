import PostList from "@/components/post/post-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { useState } from "react";
import type { PostsResponse } from "@/pages/api/posts";
export default function Posts() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const query = useInfiniteQuery<PostsResponse>({
    queryKey: ["posts", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios(
        `api/posts?page=${pageParam}&search=${search}`
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
  return (
    <PostList
      query={query}
      search={search}
      setSearch={setSearch}
      debouncedSearch={debouncedSearch}
    />
  );
}
