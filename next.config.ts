import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "skillset-bucket-project.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
