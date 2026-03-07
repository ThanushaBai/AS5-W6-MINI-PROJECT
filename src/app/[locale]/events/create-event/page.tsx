"use client"

import { useState } from "react"

export default function CreateEventPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description
      })
    })

    const data = await res.json()
    console.log(data)

    alert("Event created!")
  }

  return (
    <main style={{padding: "40px"}}>
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Create Event</button>
      </form>
    </main>
  )
}