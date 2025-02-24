/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // Haal de omgevingsvariabele op
  },
};

export default nextConfig;
