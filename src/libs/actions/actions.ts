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

export const readingActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/blogs?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch reading')
    }

    const result = await response.json()

    return {
      data: result.data.map((item: any) => ({
        id: item.id,
        ...item.attributes
      }))
    }
  },

  // Delete Blog
  delete: async (id: number) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

      const response = await fetch(`${apiURL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.error?.message || 'Failed to delete blogs')
      }

      console.log('Blog deleted successfully')

      return true
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'An error occurred')
      throw error
    }
  }

  // File Upload dengan Blog
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

  // Tambahkan method create baru
  create: async (schoolData: { title: string; address: string }) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/schools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      },
      body: JSON.stringify({
        data: {
          title: schoolData.title,
          address: schoolData.address
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to create school')
    }

    const result = await response.json()

    // Kembalikan data school yang baru dibuat
    return {
      id: result.data.id,
      ...result.data.attributes
    }
  },

  update: async (id: number, data: { title: string; address: string }) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/schools/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      },
      body: JSON.stringify({
        data: {
          title: data.title,
          address: data.address
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to update school')
    }

    const result = await response.json()

    return {
      id: result.data.id,
      ...result.data.attributes
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

export interface UserPayload {
  id: number
  email: string
  username: string
  blocked: boolean
  updatedAt: string
  phone: string
  roleUser: string
  job: string
  reports: any
  school: {
    title: string
  }
}

export const userActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/users?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const result = await response.json()

    return {
      data: result
    }
  },

  // Tambahkan method create baru
  create: async (userData: {
    email: string
    password: string
    username: string
    phone: string
    school: number
    roleUser: string
    job?: string
    reports?: number[]
  }) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        username: userData.username,
        phone: userData.phone,
        roleUser: userData.roleUser,
        job: userData.roleUser === 'teacher' ? userData.job : null,
        reports: {
          connect: userData.reports?.map(id => ({ id })) || []
        },

        school: {
          connect: [{ id: userData.school }]
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to create user')
    }

    const result = await response.json()

    // Pastikan struktur school lengkap
    return {
      ...result.user,
      reports: result.reports || [],
      school: {
        id: userData.school,
        title: result.user.school?.title || ''
      }
    }
  },
  update: async (
    id: number,
    userData: {
      email: string
      username: string
      phone: string
      school: number
      roleUser: string
      blocked: boolean
      job?: string
      reports?: number[]
    }
  ) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      },
      body: JSON.stringify({
        email: userData.email,
        username: userData.username,
        phone: userData.phone,
        roleUser: userData.roleUser,
        school: userData.school,
        blocked: userData.blocked ? 1 : 0,
        job: userData.roleUser === 'teacher' ? userData.job : null,
        reports: {
          connect: userData.reports?.map(id => ({ id })) || []
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to update user')
    }

    const result = await response.json()

    return {
      ...result
    }
  },

  // update: async (id: number, data: { title: string; address: string }) => {
  //   const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

  //   const response = await fetch(`${apiURL}/api/schools/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
  //     },
  //     body: JSON.stringify({
  //       data: {
  //         title: data.title,
  //         address: data.address
  //       }
  //     })
  //   })

  //   if (!response.ok) {
  //     const errorData = await response.json()

  //     throw new Error(errorData.error?.message || 'Failed to update school')
  //   }

  //   const result = await response.json()

  //   return {
  //     id: result.data.id,
  //     ...result.data.attributes
  //   }
  // },

  // Delete school
  delete: async (id: number) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

      const response = await fetch(`${apiURL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.error?.message || 'Failed to delete users')
      }

      console.log('users deleted successfully')

      return true
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'An error occurred')
      throw error
    }
  }

  // File Upload dengan school
}

export const reportActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/reports?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch reports')
    }

    const result = await response.json()

    return {
      data: result.data.map((item: any) => ({
        id: item.id,
        ...item.attributes,
        user: item.attributes.user,
        teacher: item.attributes.teacher,
        photoIncident: item.attributes.photoIncident
      }))
    }
  },

  create: async (reportData: {
    victimName: string
    victimClass: string
    victimGender: string
    perpetratorName: string
    perpetratorClass: string
    perpetratorGender: string
    dateIncident: string
    noteIncident: string
    timeIncident: string
    locationIncident: string
    status: string
    photoIncident?: number | null
    user: number
  }) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/reports?populate=*&pagination[pageSize]=100`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      },
      body: JSON.stringify({
        data: {
          victimName: reportData.victimName,
          victimClass: reportData.victimClass,
          victimGender: reportData.victimGender,
          perpetratorName: reportData.perpetratorName,
          perpetratorClass: reportData.perpetratorClass,
          perpetratorGender: reportData.perpetratorGender,
          dateIncident: reportData.dateIncident,
          noteIncident: reportData.noteIncident,
          timeIncident: reportData.timeIncident,
          locationIncident: reportData.locationIncident,
          status: reportData.status,
          photoIncident: reportData.photoIncident ? reportData.photoIncident : null,
          user: {
            connect: [{ id: reportData.user }]
          }
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      console.error('Create Report Error:', errorData)

      throw new Error(errorData.error?.message || 'Failed to create report')
    }

    const result = await response.json()

    return {
      id: result.data.id,
      ...result.data.attributes,
      user: result.data.attributes.user,
      photoIncident: result.data.attributes.photoIncident
    }
  },

  update: async (
    id: number,
    reportData: {
      victimName?: string
      victimClass?: string
      victimGender?: string
      perpetratorName?: string
      perpetratorClass?: string
      perpetratorGender?: string
      dateIncident?: string
      noteIncident?: string
      timeIncident?: string
      locationIncident?: string
      status?: string
      photoIncident?: number | null
      user?: number
    }
  ) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const updatePayload: any = {}

    // Hanya tambahkan field yang ada di payload
    if (reportData.victimName) updatePayload.victimName = reportData.victimName
    if (reportData.victimClass) updatePayload.victimClass = reportData.victimClass
    if (reportData.victimGender) updatePayload.victimGender = reportData.victimGender
    if (reportData.perpetratorName) updatePayload.perpetratorName = reportData.perpetratorName
    if (reportData.perpetratorClass) updatePayload.perpetratorClass = reportData.perpetratorClass
    if (reportData.perpetratorGender) updatePayload.perpetratorGender = reportData.perpetratorGender
    if (reportData.dateIncident) updatePayload.dateIncident = reportData.dateIncident
    if (reportData.noteIncident) updatePayload.noteIncident = reportData.noteIncident
    if (reportData.timeIncident) updatePayload.timeIncident = reportData.timeIncident
    if (reportData.locationIncident) updatePayload.locationIncident = reportData.locationIncident
    if (reportData.status) updatePayload.status = reportData.status

    // Handle photoIncident
    if (reportData.photoIncident !== undefined) {
      updatePayload.photoIncident = reportData.photoIncident
    }

    // Handle user
    if (reportData.user) {
      updatePayload.user = {
        connect: [{ id: reportData.user }]
      }
    }

    const response = await fetch(`${apiURL}/api/reports/${id}?populate=*&pagination[pageSize]=100`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
      },
      body: JSON.stringify({
        data: updatePayload
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to update report')
    }

    const result = await response.json()

    return {
      id: result.data.id,
      ...result.data.attributes,
      user: result.data.attributes.user,
      photoIncident: result.data.attributes.photoIncident,
      teacher: result.data.attributes.teacher
    }
  },

  // Delete school
  delete: async (id: number) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

      const response = await fetch(`${apiURL}/api/reports/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM0Njc5NTQ1LCJleHAiOjE3MzcyNzE1NDV9.A9u9t-vVObT4TJJwaMTOqU7mfJe0d0r-SS7L2JPJ2OQ`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.error?.message || 'Failed to delete report')
      }

      console.log('report deleted successfully')

      return true
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'An error occurred')
      throw error
    }
  }
}
