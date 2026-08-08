// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// module.exports = {
//   allowedDevOrigins: ['192.168.1.4'],
// }


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.4'],
  devIndicators:false
};

export default nextConfig;