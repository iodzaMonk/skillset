import { posts } from "@prisma/client";

export type Order = {
  id: string;
  client_id: string;
  product_id: string;
  date: string;
  prof_id: string;
  description: string;
  post: posts;
};
