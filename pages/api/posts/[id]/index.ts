import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Post } from "@/pages/api/posts";
import type { BaseResponse } from "@/pages/api";
export type PostResponse = BaseResponse<Post>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    const { id } = req.query;
    if (req.method === "PATCH") {
      const { title, body } = req.body;
      const response = await axios(
        `https://gorest.co.in/public/v1/posts/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            title,
            body,
          },
        }
      );
      const data = await response.data;
      res.status(200).json(data);
    } else if (req.method === "DELETE") {
      const response = await axios(
        `https://gorest.co.in/public/v1/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      res.status(200).json(data);
    } else {
      const response = await axios(
        `https://gorest.co.in/public/v1/posts/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
