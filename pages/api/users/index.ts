import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@/pages/api/login";
import type { PaginationResponse } from "@/pages/api";

export type UsersResponse = PaginationResponse<User>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    if (req.method === "GET") {
      const { page = 1, search = "" } = req.query;
      const response = await fetch(
        `https://gorest.co.in/public/v2/users?page=${page}&name=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
