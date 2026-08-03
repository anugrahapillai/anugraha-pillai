/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.5", "127.0.0.1", "localhost", "anugraha-pillai.vercel.app", "https://anugraha-pillai.vercel.app"],
  images: { remotePatterns: [] },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "Content-Security-Policy-Report-Only", value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.firebasestorage.app https://*.googleapis.com; font-src 'self'; connect-src 'self' https://*.googleapis.com wss://*.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com wss://*.firebaseio.com; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  }
};

export default nextConfig;
