"use client"

import { useState } from "react"

export default function EventForm() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    organizer: ""
  })

  const [poster, setPoster] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let posterUrl = ""

    if (poster) {
      const formData = new FormData()
      formData.append("file", poster)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      const uploadData = await uploadRes.json()

      posterUrl = uploadData.url
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        posterUrl
      })
    })

    const data = await res.json()

    console.log(data)

    alert("Event Created Successfully")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">

      <input
        name="title"
        placeholder="Event Title"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <input
        name="organizer"
        placeholder="Organizer"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPoster(e.target.files?.[0] || null)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Event
      </button>

    </form>
  )
}