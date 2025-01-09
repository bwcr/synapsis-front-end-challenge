import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export interface User {
  id?: number;
  name: string;
  email: string;
  status: string;
  gender: "male" | "female";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  if (req.method === "POST") {
    const response = await axios("https://gorest.co.in/public/v2/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    });
    if (response.status === 401) {
      res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const user: User = {
        name: data.username,
        email: `${data.username}@${data.username}.com`,
        status: "active",
        gender: "male",
      };

      const response = await axios("https://gorest.co.in/public/v2/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        data: user,
      });
      res.setHeader("Set-Cookie", [
        `username=${response.data.id}; HttpOnly; Path=/`,
        `token=${data.token}; HttpOnly; Path=/`,
      ]);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
