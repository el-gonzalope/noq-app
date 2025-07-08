// pages/api/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }).toString(),
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    const response = await axios(authOptions);
    const { access_token, refresh_token } = response.data;

    // Redirect to frontend with tokens
    res.redirect(`/?access_token=${access_token}&refresh_token=${refresh_token}`);
    // added error handling fix
  } catch (error) {
  if (error instanceof Error) {
    console.error("Error exchanging code for token:", error.message);
  } else {
    console.error("Unknown error exchanging code for token:", error);
  }
  res.status(500).send("Token exchange failed");
}

}

