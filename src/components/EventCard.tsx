import Link from "next/link"
import Image from "next/image"

type EventCardProps = {
  event: any
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">

      <Image
        src={event.posterUrl}
        alt={event.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover rounded"
      />

      <h2 className="text-xl font-semibold mt-3">
        {event.title}
      </h2>

      <p className="text-gray-600 mt-1">
        {event.location}
      </p>

      <p className="text-gray-500 text-sm">
        {new Date(event.date).toDateString()}
      </p>

      <Link
        href={`/events/${event.slug}`}
        className="inline-block mt-3 text-blue-600 font-medium"
      >
        View Details →
      </Link>

    </div>
  )
}