import { Layout, Button, Flex, Dropdown } from "antd";
import {
  PlusOutlined,
  UserOutlined,
  PoweroffOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
export default function Header() {
  const { Header } = Layout;
  const router = useRouter();
  const onLogout = async () => {
    try {
      await axios("/api/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Header
      className="flex items-center justify-between flex-row-reverse bg-neutral-100 dark:bg-neutral-900"
      style={{ padding: "0 24px" }}
    >
      {/* Add plus icon to create post */}
      <Flex gap="small" align="center">
        <Link href="/posts/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Create Post
          </Button>
        </Link>
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                icon: <UserOutlined />,
                label: "Profile",
                key: "profile",
                onClick: () => router.push("/profile"),
              },
              {
                icon: <PoweroffOutlined />,
                label: "Logout",
                onClick: onLogout,
                key: "logout",
              },
            ],
          }}
        >
          <Button type="default" icon={<UserOutlined />} />
        </Dropdown>
      </Flex>
      <Flex gap="small" align="center">
        <Link href="/">
          <Button type="default" icon={<HomeOutlined />} />
        </Link>
      </Flex>
    </Header>
  );
}
