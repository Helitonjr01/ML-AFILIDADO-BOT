import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3333";

export const api = axios.create({ baseURL: BACKEND_URL });

export async function generateStoryFromLink(url: string) {
  const { data } = await api.post<{ imageUrl: string }>(
    "/api/stories/from-link",
    { url },
  );
  return data.imageUrl;
}
