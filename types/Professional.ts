export type ProfessionalProductSummary = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number | null;
  ratingCount: number | null;
  date: string | Date;
  image_url: string | null;
};

export type ProfessionalProfile = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  stats: {
    totalProducts: number;
    averageRating: number | null;
    totalRatings: number;
  };
  posts: ProfessionalProductSummary[];
};
