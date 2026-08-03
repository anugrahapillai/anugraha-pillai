/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.5", "127.0.0.1", "localhost"],
  images: { remotePatterns: [] },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "Content-Security-Policy-Report-Only", value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  }
};

export default nextConfig;
