import EventCard from "@/components/EventCard"

async function getEvents() {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store"
  })

  return res.json()
}

export default async function EventsPage() {

  const events = await getEvents()

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Upcoming Events
      </h1>

      {events.length === 0 && (
        <p>No events created yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {events.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}

      </div>

    </div>
  )
}