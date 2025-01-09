// import { getServerSession } from 'next-auth/next'

import type { RichTextContent } from '@/types/apps/readingTypes'

// import { authOptions } from '@/libs/auth'

// export async function getAuthToken() {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       // Fallback atau throw error
//       return process.env.NEXT_PUBLIC_DEFAULT_TOKEN
//     }

//     return session.jwt
//   } catch (error) {
//     console.error('Token retrieval error:', error)

//     return process.env.NEXT_PUBLIC_DEFAULT_TOKEN
//   }
// }

export interface AspirationPayload {
  title: string
  description: string
  users_permissions_user?: number
}

export const aspirationActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/aspirations?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
      const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

      const response = await fetch(`${apiURL}/api/aspirations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
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
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/blogs?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

  update: async (
    id: number,
    data: {
      title: string
      content: RichTextContent[]
      writter?: string
      image?: number | null
      school: number
    }
  ) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    // Tambahkan populate untuk image dan school
    const response = await fetch(`${apiURL}/api/blogs/${id}?populate=image,school`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          title: data.title,
          content: data.content,
          writter: data.writter,
          image: data.image,
          school: {
            connect: [{ id: data.school }]
          }
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update reading')
    }

    const result = await response.json()

    return {
      id: result.data.id,
      ...result.data.attributes,
      title: result.data.attributes.title,
      writter: result.data.attributes.writter,
      image: {
        data: result.data.attributes.image?.data || null
      },
      school: {
        data: {
          id: data.school,
          attributes: {
            title: result.data.attributes.school?.data?.attributes?.title || ''
          }
        }
      }
    }
  },

  // Create action
  create: async (data: {
    title: string
    content: RichTextContent[]
    writter?: string
    image?: number | null
    school: number
  }) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
      const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

      // Perbaiki URL populate
      const response = await fetch(`${apiURL}/api/blogs?populate=image,school`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            title: data.title,
            content: data.content,
            writter: data.writter,
            image: data.image,
            school: {
              connect: [{ id: data.school }]
            }
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.error?.message || 'Failed to create blog')
      }

      const result = await response.json()

      return {
        id: result.data.id,
        ...result.data.attributes,
        title: result.data.attributes.title,
        writter: result.data.attributes.writter,
        image: {
          data: result.data.attributes.image?.data || null
        },
        school: {
          data: {
            id: data.school,
            attributes: {
              title: result.data.attributes.school?.data?.attributes?.title || ''
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  // Delete Blog
  delete: async (id: number) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
      const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

      const response = await fetch(`${apiURL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
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
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/schools?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
  create: async (schoolData: { title: string; address: string; user_school: number }) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/schools?populate=*`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          title: schoolData.title,
          address: schoolData.address,
          user_school: {
            connect: [{ id: schoolData.user_school }]
          }
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
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/schools/${id}?populate=*`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
      const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

      const response = await fetch(`${apiURL}/api/schools/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
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
  photo?: number | null
  school: {
    title: string
  }
}

export const userActions = {
  getAll: async () => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/users?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
    photo?: number | null
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
        photo: userData.photo ? userData.photo : null,
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
      photo: result.photo,
      school: {
        id: userData.school,
        title: result.user.school?.title || ''
      }
    }
  },

  createSchoolAdmin: async (userData: { username?: string; email?: string; password?: string; phone?: string }) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL

    const response = await fetch(`${apiURL}/api/auth/local/register?populate=*`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        roleUser: 'school', // Role khusus untuk admin sekolah
        blocked: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to create school admin')
    }

    const result = await response.json()

    return {
      id: result.user.id,
      ...result.user
    }
  },

  updateSchoolAdmin: async (
    id: number,
    userData: {
      username?: string
      email?: string
      phone?: string
      password?: string
      blocked?: boolean
    }
  ) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/users/${id}?populate=*`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        blocked: userData.blocked ? 1 : 0
      })
    })

    if (!response.ok) {
      const errorData = await response.json()

      throw new Error(errorData.error?.message || 'Failed to update school admin')
    }

    const result = await response.json()

    return {
      id: result.id,
      ...result
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
      photo?: number | null
      reports?: number[]
    }
  ) => {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email: userData.email,
        username: userData.username,
        phone: userData.phone,
        roleUser: userData.roleUser,
        school: userData.school,
        blocked: userData.blocked ? 1 : 0,
        photo: userData.photo ? userData.photo : null,
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
  //       Authorization: `Bearer ${token}`
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
      const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

      const response = await fetch(`${apiURL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
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
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/reports?populate=*&pagination[pageSize]=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    const response = await fetch(`${apiURL}/api/reports?populate=*&pagination[pageSize]=100`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

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
        Authorization: `Bearer ${token}`
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
      const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

      const response = await fetch(`${apiURL}/api/reports/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
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
