import { commands, reviews } from "@prisma/client";

export type ReviewWithAuthor = reviews & {
  users?: {
    id: string;
    name: string | null;
  };
};

export type PostBody = {
  id?: string;
  prof_id?: string;
  user_id: string;
  title: string;
  description: string;
  rating?: number | null;
  ratingCount?: number;
  users?: {
    id: string;
    name: string;
    country: string;
    email: string;
  } | null;
  price: number;
  category: string;
  date?: Date;
  image_location?: string;
  image_url?: string | null;
  commands?: commands[];
  reviews?: ReviewWithAuthor[];
};
