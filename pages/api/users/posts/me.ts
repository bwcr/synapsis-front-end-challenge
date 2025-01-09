import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { PostsResponse } from "@/pages/api/posts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const username = req.cookies.username;
    if (req.method === "GET") {
      const { page = 1, search = "" } = req.query;
      const response = await axios<PostsResponse>(
        `https://gorest.co.in/public/v1/users/${username}/posts?page=${page}&title=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.cookies.token}`,
          },
        }
      );
      const data = await response.data;
      data.data.map((post) => {
        post.editable = post.user_id === Number(username);
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
