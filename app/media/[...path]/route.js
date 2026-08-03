import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { path } = await params;
  const assetPath = Array.isArray(path) ? path.join("/") : path;

  if (!assetPath) {
    return new NextResponse("Asset Not Found", { status: 404 });
  }

  // Placeholder proxy behavior serving cached media response headers
  return new NextResponse(`Media Asset: ${assetPath}`, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
