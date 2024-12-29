export interface AspirationPayload {
  title: string
  description: string
  users_permissions_user?: number
}

export const aspirationActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/aspirations?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch aspirations')
    }

    const result = await response.json()

    return {
      data: result.data.map((item: any) => ({
        id: item.id,
        ...item.attributes
      }))
    }
  },

  // Delete Aspiration
  delete: async (id: number) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

      const response = await fetch(`${apiURL}/api/aspirations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.error?.message || 'Failed to delete aspiration')
      }

      console.log('Aspiration deleted successfully')

      return true
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'An error occurred')
      throw error
    }
  }

  // File Upload dengan Aspiration
}

export interface SchoolPayload {
  title: string
  address: string
}

export const schoolActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/schools?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch schools')
    }

    const result = await response.json()

    return {
      data: result.data.map((item: any) => ({
        id: item.id,
        ...item.attributes
      }))
    }
  },

  // Delete school
  delete: async (id: number) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

      const response = await fetch(`${apiURL}/api/schools/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.error?.message || 'Failed to delete school')
      }

      console.log('school deleted successfully')

      return true
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'An error occurred')
      throw error
    }
  }

  // File Upload dengan school
}
