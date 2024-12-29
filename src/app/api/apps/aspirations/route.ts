// app/api/blogs/route.ts
import { NextResponse } from 'next/server'

import { getAspirations } from './aspirations'

export async function GET() {
  const { data, error } = await getAspirations()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
