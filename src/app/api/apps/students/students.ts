// lib/api/blogs.ts

export async function getStudents() {
  const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

  //   const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString()

  try {
    const response = await fetch(`${apiURL}/api/users?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      },
      cache: 'no-store' // atau 'force-cache' untuk caching
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Students')
    }

    const result = await response.json()

    return {
      data: result,
      error: null
    }
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}