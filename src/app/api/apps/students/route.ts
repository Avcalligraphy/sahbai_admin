import { NextResponse } from 'next/server'

import { getStudents } from './students'

export async function GET() {
  const { data, error } = await getStudents()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
