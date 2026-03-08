import { NextRequest, NextResponse } from "next/server"
import { eventSchema } from "@/lib/schemas"
import { addEvent, getEvents, getEventBySlug } from "@/lib/db"
import { generateSlug, generateId } from "@/lib/utils"
import { verifyAuthToken } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    const events = await getEvents()

    return NextResponse.json(events)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events. Check MongoDB configuration." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    const isValidToken = token ? Boolean(verifyAuthToken(token)) : false;

    if (!isValidToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await req.json()

    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data

    let slug = generateSlug(data.title)
    if (await getEventBySlug(slug)) {
      slug = `${slug}-${Date.now()}`
    }

    const newEvent = {
      id: generateId(),
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      category: data.category,
      organizer: data.organizer,
      posterUrl: data.posterUrl,
      slug,
      createdAt: new Date().toISOString()
    }

    await addEvent(newEvent)
    revalidateTag("events", "max");
    revalidateTag(`event:${newEvent.slug}`, "max");

    const webhookUrl = new URL("/api/webhook/event-created", req.url)

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: "event_created",
        title: newEvent.title,
        date: newEvent.date
      })
    })

    return NextResponse.json(newEvent, { status: 201 })

  } catch {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}
