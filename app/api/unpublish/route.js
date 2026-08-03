import { NextResponse } from "next/server";
import {
  firestorePosts,
  firestorePosters,
  firestoreResearch,
  firestoreServices,
  firestorePages,
  firestoreSettings,
} from "@/lib/repositories/firestore-adapters";

function getAdapter(type) {
  switch ((type || "").toLowerCase()) {
    case "blog":
    case "posts":
      return firestorePosts;
    case "poster":
    case "posters":
      return firestorePosters;
    case "research":
      return firestoreResearch;
    case "service":
    case "services":
      return firestoreServices;
    case "page":
    case "pages":
      return firestorePages;
    case "setting":
    case "settings":
      return firestoreSettings;
    default:
      return firestorePosts;
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id;
    const type = body.type;

    if (!id) {
      return NextResponse.json({ error: "Missing item id for unpublish operation." }, { status: 400 });
    }

    const adapter = getAdapter(type);
    const result = await adapter.update(id, { status: "draft", deliveryState: null });

    return NextResponse.json({
      success: true,
      item: result,
      message: "Unpublished and reverted to draft status.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
