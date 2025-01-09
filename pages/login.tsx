import { Alert, Button, Input, Form, Card, Typography, Flex } from "antd";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
export default function Home() {
  const router = useRouter();
  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (data: { username: string; token: string }) => {
      await axios("/api/login", {
        method: "POST",
        data,
      });
    },
  });
  const onFinish = async (values: { username: string; token: string }) => {
    try {
      await mutateAsync(values);
      router.push("/");
    } catch (error) {}
  };
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <Card className="max-w-sm w-full">
        <div className="flex flex-col items-center justify-center mb-4">
          <Typography.Title level={1} className="text-center">
            Blog Post App
          </Typography.Title>
          <Typography.Text type="secondary" className="w-full text-center">
            Please enter your email and token to login
          </Typography.Text>
        </div>
        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Flex vertical gap="small">
            {error && (
              <Alert type="error" showIcon message="Invalid email or token" />
            )}
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
                {
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="token"
              rules={[
                {
                  required: true,
                  message: "Please input your token!",
                },
              ]}
            >
              <Input placeholder="Token" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isPending}
              >
                Login
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Card>
    </div>
  );
}
