/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.pravatar.cc",
      "picsum.photos",
      "tailwindui.com",
      "lh3.googleusercontent.com",
      "cofo-blog-web-media-bucket.s3.amazonaws.com",
      "mediastack-mediabucketbcbb02ba-13exmuwc5ys0l.s3.amazonaws.com",
    ],
  },
  crossOrigin: "anonymous",
};

module.exports = nextConfig;
