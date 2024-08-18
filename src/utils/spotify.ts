const clientId = "d36dc849405f4cd1badfcc319be94e6c";
const clientSecret = "e175ccffb6e741388083e6bb7d4c8a6e";

async function getAuthToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });
  const data = await response.json();
  return data.access_token;
}

async function getAlbumId(authToken: string, albumName: string, bandName: string) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=album:${albumName}+artist:${bandName}&type=album`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  const albumId = data.albums.items[0].id;
  const albumUrl = data.albums.items[0].external_urls.spotify;
  const albumCoverUrl = data.albums.items[0].images.find((image: { width: number }) => image.width >= 300)?.url || "";
  return { albumId, albumUrl, albumCoverUrl };
}

async function getSongId(authToken: string, albumId: string) {
  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  const songId = data.items[0].id;
  return songId;
}

async function getPreviewUrl(authToken: string, songId: string) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  const previewUrl = data.preview_url;
  return previewUrl;
}

export { getAuthToken, getAlbumId, getSongId, getPreviewUrl };
