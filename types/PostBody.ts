import { commands, reviews } from "@prisma/client";

export type PostBody = {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  date?: Date;
  image_location?: string;
  image_url?: string | null;
  commands?: commands[];
  reviews?: reviews[];
};
