import type { NextConfig } from "next";

import createMDX from "@next/mdx";
import slug from "rehype-slug";

const withMDX = createMDX({
  options: {
    rehypePlugins: [slug],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins: ["localhost", "localhost:80", "*.github.dev"],
    },
  },
  poweredByHeader: false,
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default withMDX(nextConfig);
