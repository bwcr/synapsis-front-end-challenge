import type React from "react";
import {
  Button,
  Card,
  Flex,
  Input,
  Skeleton,
  Typography,
  Row,
  Col,
} from "antd";
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";
import type { PostsResponse } from "@/pages/api/posts";
import PostListCard from "./post-list-card";
export default function PostList({
  query,
  search,
  setSearch,
  debouncedSearch,
}: {
  query: UseInfiniteQueryResult<InfiniteData<PostsResponse, unknown>, Error>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: string;
}) {
  useInfiniteQuery;
  const { data, status, error, hasNextPage, isFetching } = query;

  return (
    <Flex vertical gap="small" className="w-full">
      <Typography.Title level={1}>Blog Posts</Typography.Title>
      <Input.Search
        placeholder="Search posts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {debouncedSearch && (
        <Flex vertical gap="small">
          <Typography.Text>
            Search results for <strong>{debouncedSearch}</strong>
          </Typography.Text>
          <Button onClick={() => setSearch("")} className="w-fit">
            Clear filter
          </Button>
        </Flex>
      )}
      {status === "pending" ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 5 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Col key={index} span={24} md={12} lg={8}>
              <Card title={<Skeleton.Input style={{ width: 200 }} />}>
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
      ) : status === "error" ? (
        <Typography.Text type="danger">{error?.message}</Typography.Text>
      ) : (
        <Row gutter={[16, 16]}>
          {/* Item per page is 10 */}
          {data?.pages.map((page) =>
            page.data.map((post, index, posts) => (
              <Col key={post.id} span={24} md={12} lg={8} test-id="post-list">
                <PostListCard
                  key={post.id}
                  post={post}
                  posts={posts}
                  index={index}
                  query={query}
                />
              </Col>
            ))
          )}
        </Row>
      )}
      {hasNextPage && isFetching && (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 2 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Col key={index} span={24} md={12} lg={8}>
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                title={<Skeleton.Input style={{ width: 200 }} />}
              >
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Flex>
  );
}
