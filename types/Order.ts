import { Category } from "./Category";
import { Status } from "./Status";

type Post = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  rating: number | null;
  ratingCount: number;
  price: number;
  date: Date;
  image_location: string | null;
  category: Category;
};

export type Order = {
  id: string;
  client_id: string;
  product_id: string;
  date: string;
  prof_id: string;
  description: string;
  status: Status;
  post: Post;
};
