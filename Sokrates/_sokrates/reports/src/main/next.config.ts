import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import webpack from "webpack";
import { config as loadEnv } from "dotenv";

const { parsed: loadedEnv } = loadEnv();

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  webpack(cfg) {
    if (loadedEnv) {
      cfg.plugins.push(new webpack.EnvironmentPlugin(loadedEnv));
    }
    return cfg;
  },
};

export default withFlowbiteReact(nextConfig);
