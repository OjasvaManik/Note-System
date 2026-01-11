export type Note = {
  id: string;
  title: string | null;
  emoji?: string | null;
  bannerUrl?: string | null;
  content?: string | null; // JSON string
  createdAt: string;
  updatedAt: string;
};