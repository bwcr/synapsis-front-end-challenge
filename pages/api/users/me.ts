import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const username = req.cookies.username;
    if (req.method === "GET") {
      const response = await fetch(
        `https://gorest.co.in/public/v1/users/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.cookies.token}`,
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
