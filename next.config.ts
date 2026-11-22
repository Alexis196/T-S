import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Permite subir fotos de productos desde el panel de administración.
    serverActions: { bodySizeLimit: "10mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
