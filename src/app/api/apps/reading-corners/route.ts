import { NextResponse } from 'next/server'

import { getReadingCorners } from './readingCorners'

export async function GET() {
  const { data, error } = await getReadingCorners()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
