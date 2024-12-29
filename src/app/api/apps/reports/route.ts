import { NextResponse } from 'next/server'

import { getReports } from './reports'

export async function GET() {
  const { data, error } = await getReports()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
