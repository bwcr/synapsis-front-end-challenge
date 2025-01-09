import { Layout, Typography } from "antd";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { Content, Footer } = Layout;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content
        className={`flex flex-col ${inter.className}`}
        style={{ padding: "24px", flex: 1 }}
      >
        {children}
      </Content>
      <Footer className="flex items-center justify-center">
        <Typography.Text>
          © {new Date().getFullYear()} Copyright by{" "}
          <Link href="https://github.com/bwcr">bwcr</Link>
        </Typography.Text>
      </Footer>
    </Layout>
  );
}
