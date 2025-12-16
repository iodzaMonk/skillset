import { posts } from "@prisma/client";
import { Status } from "./Status";

export type Order = {
  id: string;
  client_id: string;
  product_id: string;
  date: string;
  prof_id: string;
  description: string;
  status: Status;
  post: posts;
};
