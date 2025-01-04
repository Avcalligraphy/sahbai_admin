// lib/api/blogs.ts

export async function getStudents() {
  const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
  const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

  //   const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString()

  try {
    const response = await fetch(`${apiURL}/api/users?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
