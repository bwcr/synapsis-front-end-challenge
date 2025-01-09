import { Flex, Typography, Form, notification } from "antd";
import axios from "axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PostForm, type PostInput } from "@/components/post/post-form";
import type { PostResponse } from "@/pages/api/posts/[id]";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query: params } = router;
  const mutation = useMutation({
    mutationFn: async (values: PostInput) => {
      const response = await axios(`/api/posts/${params.id}`, {
        method: "PATCH",
        data: values,
      });
      return response.data;
    },
    onSuccess: () => {
      notification.success({
        message: "Post updated successfully",
      });
    },
    onError: () => {
      notification.error({
        message: "Error updating post",
      });
    },
  });
  const query = useQuery<PostResponse>({
    queryKey: ["posts", "edit", params.id],
    queryFn: async () => {
      const response = await axios(`/api/posts/${params.id}`);
      return response.data;
    },
  });
  const [form] = Form.useForm<PostInput>();
  const onFinish = async (values: PostInput) => {
    mutation.mutate(values);
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
    form.resetFields();
    router.push("/");
  };

  return (
    <Flex vertical gap="small" className="w-full">
      <Typography.Title level={1}>Edit Post</Typography.Title>
      <PostForm
        form={form}
        onFinish={onFinish}
        mutation={mutation}
        query={query}
      />
    </Flex>
  );
}
