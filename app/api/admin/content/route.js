import { NextResponse } from "next/server";
import { firestorePosts, firestorePosters, firestoreResearch, firestoreServices, firestorePages, firestoreSettings } from "@/lib/repositories/firestore-adapters";

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const state = searchParams.get("state");
    const query = searchParams.get("q");

    const adapter = getAdapter(type);
    const result = await adapter.list({ state, queryStr: query });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const adapter = getAdapter(data.type);

    let result;
    if (data.id) {
      result = await adapter.update(data.id, data);
    } else {
      result = await adapter.create(data);
    }

    return NextResponse.json({ success: true, item: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { action, id, type } = await request.json();
    const adapter = getAdapter(type);

    let result;
    if (action === "publish") {
      result = await adapter.publish(id);
    } else if (action === "duplicate") {
      result = await adapter.duplicate(id);
    } else if (action === "delete") {
      result = await adapter.delete(id);
    } else if (action === "archive") {
      result = await adapter.archive(id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }

    const adapter = getAdapter(type);
    const result = await adapter.delete(id);
    return NextResponse.json({ success: true, item: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
