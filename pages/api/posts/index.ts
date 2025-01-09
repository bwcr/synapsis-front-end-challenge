import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { PaginationResponse } from "@/pages/api";

export type Post = {
  body: string;
  id: number;
  title: string;
  user_id: number;
  editable: boolean;
};

export type PostsResponse = PaginationResponse<Post>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    const username = req.cookies.username;
    if (req.method === "POST") {
      const { title, body } = req.body;
      const response = await axios("https://gorest.co.in/public/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          title,
          body,
          user_id: username,
        },
      });
      const data = await response.data;
      res.status(200).json(data);
    } else {
      const { page = 1, search = "" } = req.query;
      const response = await axios<PostsResponse>(
        `https://gorest.co.in/public/v1/posts?page=${page}&title=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      data.data.map((post: Post) => {
        post.editable = post.user_id === Number(username);
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
