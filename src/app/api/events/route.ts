import { NextResponse } from "next/server"
import { eventSchema } from "@/lib/schemas"
import { addEvent, getEvents } from "@/lib/db"
import { generateSlug, generateId } from "@/lib/utils"

export async function GET() {
  const events = getEvents()

  return NextResponse.json(events)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = validation.data

    const newEvent = {
      id: generateId(),
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      category: data.category,
      organizer: data.organizer,
      posterUrl: data.posterUrl,
      slug: generateSlug(data.title),
      createdAt: new Date().toISOString()
    }

    addEvent(newEvent)

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/event-created`, {
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

    return NextResponse.json(newEvent)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}