import { notFound } from "next/navigation"
import Image from "next/image"

async function getEvent(slug: string) {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store"
  })

  const events = await res.json()

  return events.find((event: any) => event.slug === slug)
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params

  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto p-10">

      <Image
  src={event.posterUrl}
  alt={event.title}
  width={900}
  height={500}
  className="w-full h-96 object-cover rounded-lg"
/>

      <h1 className="text-4xl font-bold mt-6">
        {event.title}
      </h1>

      <p className="text-gray-600 mt-2">
        {event.location}
      </p>

      <p className="text-gray-500">
        {new Date(event.date).toDateString()}
      </p>

      <p className="mt-6">
        {event.description}
      </p>

      <p className="mt-4 font-medium">
        Organized by: {event.organizer}
      </p>

    </div>
  )
}