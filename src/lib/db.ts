import { Event } from "@/types/event"

let events: Event[] = []

export function getEvents() {
  return events
}

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug)
}

export function addEvent(event: Event) {
  events.push(event)
  return event
}