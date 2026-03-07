import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const payload = await req.json()

  console.log("Webhook Triggered:", payload)

  return NextResponse.json({
    message: "Webhook received",
    data: payload
  })
}