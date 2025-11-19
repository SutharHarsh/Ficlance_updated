// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // recommended: allow by remotePattern (more flexible)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // add more hosts if you need, for example:
      // { protocol: "https", hostname: "images.example-cdn.com", pathname: "/**" },
    ],

    // Alternative (simpler) option:
    // domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
