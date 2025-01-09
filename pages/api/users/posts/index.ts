import type { NextApiRequest, NextApiResponse } from "next";
import type { Post } from "@/pages/api/posts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    if (req.method === "GET") {
      const { page = 1, search = "" } = req.query;
      const response = await fetch(
        `https://gorest.co.in/public/v1/users/${req.query.userId}/posts?page=${page}&title=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      data.map((post: Post) => {
        post.editable = post.user_id === Number(req.cookies.username);
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
