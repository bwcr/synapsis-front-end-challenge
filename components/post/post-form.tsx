import type { PostResponse } from "@/pages/api/posts/[id]";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { type FormInstance, Input, Card, Form, Button, Skeleton } from "antd";

export interface PostInput {
  title: string;
  body: string;
}

export function PostForm({
  form,
  onFinish,
  mutation,
  query,
}: {
  form: FormInstance<PostInput>;
  onFinish: (values: PostInput) => Promise<void>;
  query?: UseQueryResult<PostResponse, Error>;
  mutation: UseMutationResult<PostInput, unknown, PostInput, unknown>;
}) {
  return (
    <Card className="w-full" loading={query?.isFetching}>
      {query?.isFetching ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            title: query?.data?.data.title,
            body: query?.data?.data.body,
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please input the body!" }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}
