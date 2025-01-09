import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { PaginationResponse } from "@/pages/api";
export interface Comments {
  id: number;
  name: string;
  email: string;
  body: string;
}

export type CommentsResponse = PaginationResponse<Comments>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    const { id } = req.query;
    const response = await axios(
      `https://gorest.co.in/public/v2/posts/${id}/comments`,
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
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
