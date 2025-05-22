let accessToken = null;
let tokenExpires = 0;

async function getSpotifyAccessToken() {
  if (accessToken && Date.now() < tokenExpires) {
    return accessToken;
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpires = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }
  const token = await getSpotifyAccessToken();
  const searchRes = await fetch(`https://api.spotify.com/v1/search?type=track&limit=8&q=${encodeURIComponent(q)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await searchRes.json();
  res.status(200).json(data.tracks ? data.tracks.items : []);
} 