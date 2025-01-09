import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@/pages/api/login";
import type { BaseResponse } from "@/pages/api";

export type UserResponse = BaseResponse<User>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    const { id } = req.query;
    const response = await fetch(`https://gorest.co.in/public/v2/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
