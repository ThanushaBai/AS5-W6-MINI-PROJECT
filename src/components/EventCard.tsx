import Image from "next/image"
import { Event } from "@/types/event"
import EventActions from "@/components/EventActions";

type EventCardProps = {
  event: Event
  locale: string
  viewDetailsLabel: string
}

export default function EventCard({ event, locale, viewDetailsLabel }: EventCardProps) {
  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">

      <Image
        src={event.posterUrl}
        alt={event.title}
        width={400}
        height={200}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={75}
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

      <p className="mt-2 text-sm text-slate-600">
        {event.description.length > 80 ? `${event.description.slice(0, 80)}...` : event.description}
      </p>

      <EventActions locale={locale} slug={event.slug} readMoreLabel={viewDetailsLabel} />

    </div>
  )
}
