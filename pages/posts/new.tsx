// Create new post layout with antd components
import { Flex, Typography, Form, notification } from "antd";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PostForm, type PostInput } from "@/components/post/post-form";

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (values: PostInput) => {
      const response = await axios("/api/posts", {
        method: "POST",
        data: values,
      });
      return response.data;
    },
    onSuccess: () => {
      notification.success({
        message: "Post created successfully",
      });
    },
    onError: () => {
      notification.error({
        message: "Error creating post",
      });
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
      <Typography.Title level={1}>Create New Post</Typography.Title>
      <PostForm form={form} onFinish={onFinish} mutation={mutation} />
    </Flex>
  );
}
