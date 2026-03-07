import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  const data = await req.formData()

  const file = data.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  if (file.size > 3 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File must be smaller than 3MB" },
      { status: 400 }
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = Date.now() + "-" + file.name

  const uploadPath = path.join(process.cwd(), "public/uploads", fileName)

  fs.writeFileSync(uploadPath, buffer)

  return NextResponse.json({
    url: `/uploads/${fileName}`
  })
}