import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "https://lookerstudio.google.com",
      // Agregar dominios según sea necesario
    ],
    // O usar remotePatterns para mayor control
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permitir todos los dominios HTTPS
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["*"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https://lookerstudio.google.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lookerstudio.google.com",
              "style-src 'self' 'unsafe-inline' https://lookerstudio.google.com",
              "img-src 'self' data: https: https://lookerstudio.google.com",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:8000 https://lookerstudio.google.com https://scraper.deepfeel.xyz",
              "frame-src 'self' https://lookerstudio.google.com https://*.google.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
