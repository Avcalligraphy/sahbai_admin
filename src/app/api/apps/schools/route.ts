import { NextResponse } from 'next/server'

import { getSchools } from './schools'

export async function GET() {
  const { data, error } = await getSchools()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
