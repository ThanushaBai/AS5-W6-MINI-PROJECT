import { NextRequest, NextResponse } from "next/server";
import { deleteEventBySlug, getEventBySlug, updateEventBySlug } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth";
import { eventSchema } from "@/lib/schemas";
import { revalidateTag } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event. Check MongoDB configuration." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const isValidToken = token ? Boolean(verifyAuthToken(token)) : false;
    if (!isValidToken) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const updatedEvent = await updateEventBySlug(slug, validation.data);
    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    revalidateTag("events", "max");
    revalidateTag(`event:${slug}`, "max");

    return NextResponse.json(updatedEvent);
  } catch {
    return NextResponse.json(
      { error: "Failed to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const isValidToken = token ? Boolean(verifyAuthToken(token)) : false;
    if (!isValidToken) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    const { slug } = await params;
    const deleted = await deleteEventBySlug(slug);
    if (!deleted) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    revalidateTag("events", "max");
    revalidateTag(`event:${slug}`, "max");

    return NextResponse.json({ message: "Event deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete event." },
      { status: 500 }
    );
  }
}
