/* eslint-disable @typescript-eslint/no-unused-vars */
// @/context/AppContext.tsx
'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

// Import semua tipe yang dibutuhkan
import type { AspirationsType } from '@/types/apps/aspirationsTypes'
import type { SchoolsType } from '@/types/apps/schoolsTypes'
import { aspirationActions, readingActions, reportActions, schoolActions, userActions } from '@/libs/actions/actions'
import type { UsersType } from '@/types/apps/userTypes'
import type { ReportsType } from '@/types/apps/reportsTypes'
import type { ReadingType, RichTextContent } from '@/types/apps/readingTypes'

// Import semua actions
type Reading = {
  id?: number
  title: string
  content: RichTextContent[]

  // tambahkan field lain sesuai kebutuhan
}

// Extend AppContextType untuk menambahkan Schools
type AppContextType = {
  aspirations: AspirationsType[]
  aspirationsLoading: boolean
  aspirationsError: string | null
  fetchAspirations: () => Promise<void>
  deleteAspiration: (id: number) => Promise<void>
  deleteMultipleAspirations: (ids: number[]) => Promise<void>

  // blogs
  readings: ReadingType[]
  readingsLoading: boolean
  readingsError: string | null
  fetchReadings: () => Promise<void>
  createReadings: (data: {
    title: string
    content: RichTextContent[]
    writter?: string
    image?: number | null
    school: number
  }) => Promise<void>
  updateReadings: (data: {
    id: number
    title: string
    content: RichTextContent[]
    writter?: string
    image?: number | null
    school: number
  }) => Promise<void>
  deleteReading: (id: number) => Promise<void>
  deleteMultipleReadings: (ids: number[]) => Promise<void>

  // Reports
  reports: ReportsType[]
  reportsLoading: boolean
  reportsError: string | null
  createReport: (data: {
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
  }) => Promise<void>

  updateReport: (data: {
    id: number
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
  }) => Promise<void>
  fetchReports: () => Promise<void>
  deleteReport: (id: number) => Promise<void>
  deleteMultipleReports: (ids: number[]) => Promise<void>

  // Schools (Tambahan)
  schools: SchoolsType[]
  schoolsLoading: boolean
  schoolsError: string | null
  fetchSchools: () => Promise<void>
  createSchool: (data: {
    title: string
    address: string
    schoolsStatus?: string
    adminName?: string
    adminEmail?: string
    adminPassword?: string
    adminPhone?: string
    user_school?: number
  }) => Promise<void>
  updateSchool: (data: {
    id?: number
    title: string
    address: string
    adminName?: string
    adminEmail?: string
    adminPassword?: string
    blocked: boolean
    adminPhone?: string
    user_school: number
  }) => Promise<void>
  deleteSchool: (id: number) => Promise<void>
  deleteMultipleSchools: (ids: number[]) => Promise<void>

  // Users
  users: UsersType[]
  usersLoading: boolean
  usersError: string | null
  createUser: (data: {
    email: string
    password: string
    username: string
    phone: string
    school: number
    roleUser: string
    photo?: number | null
    job: string
    reports?: number[]
  }) => Promise<void>

  updateUser: (data: {
    id: number
    email: string
    username: string
    phone: string
    roleUser: string
    school: number
    blocked: boolean
    photo?: number | null
    job: string
    reports?: number[]
  }) => Promise<void>
  fetchUsers: () => Promise<void>
  deleteUser: (id: number) => Promise<void>
  deleteMultipleUsers: (ids: number[]) => Promise<void>
}

// Update context default value
const AppContext = createContext<AppContextType>({
  // Aspirations defaults
  aspirations: [],
  aspirationsLoading: false,
  aspirationsError: null,
  fetchAspirations: async () => {},
  deleteAspiration: async () => {},
  deleteMultipleAspirations: async () => {},

  // Reading
  readings: [],
  readingsLoading: false,
  readingsError: null,
  fetchReadings: async () => {},
  createReadings: async () => {},
  updateReadings: async () => {},
  deleteReading: async () => {},
  deleteMultipleReadings: async () => {},

  // Schools defaults (Tambahan)
  schools: [],
  schoolsLoading: false,
  schoolsError: null,
  fetchSchools: async () => {},
  createSchool: async () => {},
  updateSchool: async () => {},
  deleteSchool: async () => {},
  deleteMultipleSchools: async () => {},

  // Reports
  reports: [],
  reportsLoading: false,
  reportsError: null,
  createReport: async () => {},
  updateReport: async () => {},
  fetchReports: async () => {},
  deleteReport: async () => {},
  deleteMultipleReports: async () => {},

  // Users Context
  users: [],
  usersLoading: false,
  usersError: null,
  createUser: async () => {},
  updateUser: async () => {},
  fetchUsers: async () => {},
  deleteUser: async () => {},
  deleteMultipleUsers: async () => {}
})

// Provider Component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State untuk Aspirations
  const [aspirations, setAspirations] = useState<AspirationsType[]>([])
  const [aspirationsLoading, setAspirationsLoading] = useState(false)
  const [aspirationsError, setAspirationsError] = useState<string | null>(null)

  // State Reading
  const [readings, setReadings] = useState<ReadingType[]>([])
  const [readingsLoading, setReadingsLoading] = useState(false)
  const [readingsError, setReadingsError] = useState<string | null>(null)

  // Tambahkan state untuk Schools
  const [schools, setSchools] = useState<SchoolsType[]>([])
  const [schoolsLoading, setSchoolsLoading] = useState(false)
  const [schoolsError, setSchoolsError] = useState<string | null>(null)

  // State Users
  const [users, setUsers] = useState<UsersType[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  // Reports
  const [reports, setReports] = useState<ReportsType[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState<string | null>(null)

  const fetchReadings = async () => {
    setReadingsLoading(true)

    try {
      const response = await readingActions.getAll()

      setReadings(response.data)
      setReadingsError(null)
    } catch (error) {
      setAspirationsError(error instanceof Error ? error.message : 'Failed to fetch reading')
    } finally {
      setReadingsLoading(false)
    }
  }

  // Membuat reading baru
  const createReadings = async (data: {
    title: string
    content: RichTextContent[]
    writter?: string
    image?: number | null
    school: number
  }) => {
    setReadingsLoading(true)
    setReadingsError(null)

    try {
      const newReading = await readingActions.create(data)

      setReadings(prev => [...prev, newReading])
    } catch (error) {
      setReadingsError(error instanceof Error ? error.message : 'Failed to create reading')
      throw error
    } finally {
      setReadingsLoading(false)
    }
  }

  const updateReadings = async (data: {
    id: number
    title: string
    content: RichTextContent[]
    writter?: string
    image?: number | null
    school: number
  }) => {
    setReadingsLoading(true)
    setReadingsError(null)

    try {
      const updatedReading = await readingActions.update(data.id, data)

      setReadings(prev => prev.map(reading => (reading.id === data.id ? updatedReading : reading)))
    } catch (error) {
      setReadingsError(error instanceof Error ? error.message : 'Failed to update reading')
      throw error
    } finally {
      setReadingsLoading(false)
    }
  }

  const deleteReading = async (id: number) => {
    try {
      await readingActions.delete(id)
      setReadings(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      setReadingsError(error instanceof Error ? error.message : 'Failed to delete reading')
    }
  }

  const deleteMultipleReadings = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => readingActions.delete(id)))

      setReadings(prev => prev.filter(item => !ids.includes(item.id!)))
    } catch (error) {
      setReadingsError(error instanceof Error ? error.message : 'Failed to delete readings')
    }
  }

  // Readings
  const fetchAspirations = async () => {
    setAspirationsLoading(true)

    try {
      const response = await aspirationActions.getAll()

      setAspirations(response.data)
      setAspirationsError(null)
    } catch (error) {
      setAspirationsError(error instanceof Error ? error.message : 'Failed to fetch aspirations')
    } finally {
      setAspirationsLoading(false)
    }
  }

  const deleteAspiration = async (id: number) => {
    try {
      await aspirationActions.delete(id)
      setAspirations(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      setAspirationsError(error instanceof Error ? error.message : 'Failed to delete aspiration')
    }
  }

  const deleteMultipleAspirations = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => aspirationActions.delete(id)))
      setAspirations(prev => prev.filter(item => !ids.includes(item.id)))
    } catch (error) {
      setAspirationsError(error instanceof Error ? error.message : 'Failed to delete aspirations')
    }
  }

  // Schools Methods
  const fetchSchools = async () => {
    setSchoolsLoading(true)

    try {
      const response = await schoolActions.getAll() // Pastikan Anda membuat method ini di schoolActions

      setSchools(response.data)
      setSchoolsError(null)
    } catch (error) {
      setSchoolsError(error instanceof Error ? error.message : 'Failed to fetch schools')
    } finally {
      setSchoolsLoading(false)
    }
  }

  const createSchool = async (data: {
    title: string
    address: string
    adminName?: string
    adminEmail?: string
    adminPassword?: string
    adminPhone?: string
    user_school?: number
  }) => {
    try {
      // Buat user admin sekolah terlebih dahulu
      const schoolAdmin = await userActions.createSchoolAdmin({
        username: data.adminName,
        email: data.adminEmail,
        password: data.adminPassword,
        phone: data.adminPhone
      })

      // Buat sekolah dengan menggunakan ID user yang baru dibuat
      const newSchool = await schoolActions.create({
        title: data.title,
        address: data.address,
        user_school: schoolAdmin.id // Gunakan ID user yang baru dibuat
      })

      // Update state schools
      setSchools(prev => [
        ...prev,
        {
          ...newSchool,
          user_school: {
            data: {
              id: schoolAdmin.id,
              attributes: schoolAdmin
            }
          },
          users_permissions_users: {
            data: [
              {
                id: schoolAdmin.id,
                attributes: schoolAdmin
              }
            ]
          },
          teachers: { data: [] },
          schoolsStatus: 'Active'
        }
      ])

      return newSchool
    } catch (error) {
      // Hapus user yang sudah dibuat jika proses gagal
      if (error instanceof Error) {
        console.error('Failed to create school:', error)

        // Tambahkan logika untuk menghapus user jika sekolah gagal dibuat
        // Anda bisa menambahkan metode deleteUser di userActions jika diperlukan
      }

      setSchoolsError(error instanceof Error ? error.message : 'Failed to create school')
      throw error
    }
  }

  const updateSchool = async (data: {
    id?: number
    title: string
    address: string
    adminName?: string
    adminEmail?: string
    adminPhone?: string
    user_school: number
    blocked: boolean
  }) => {
    try {
      if (!data.id) {
        throw new Error('School ID is required for update')
      }

      const updatedSchool = await schoolActions.update(data.id, {
        title: data.title,
        address: data.address
      })

      console.log('Updated School Result:', updatedSchool)

      const updateAdminSchool = await userActions.updateSchoolAdmin(data.user_school, {
        username: data.adminName,
        email: data.adminEmail,
        phone: data.adminPhone,
        blocked: data.blocked
      })

      console.log('Updated Admin Result:', updateAdminSchool)

      setSchools(prev =>
        prev.map(school =>
          school.id === data.id
            ? {
                ...school,
                ...updatedSchool,
                user_school: {
                  data: {
                    id: data.user_school,
                    attributes: updateAdminSchool
                  }
                },
                users_permissions_users: {
                  data: school.users_permissions_users.data.map(user =>
                    user.id === data.user_school
                      ? {
                          ...user,
                          attributes: updateAdminSchool
                        }
                      : user
                  )
                }
              }
            : school
        )
      )

      return updatedSchool
    } catch (error) {
      setSchoolsError(error instanceof Error ? error.message : 'Failed to update school')
      throw error
    }
  }

  const deleteSchool = async (id: number) => {
    try {
      await schoolActions.delete(id)
      setSchools(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      setSchoolsError(error instanceof Error ? error.message : 'Failed to delete school')
    }
  }

  const deleteMultipleSchools = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => schoolActions.delete(id)))
      setSchools(prev => prev.filter(item => !ids.includes(item.id)))
    } catch (error) {
      setSchoolsError(error instanceof Error ? error.message : 'Failed to delete schools')
    }
  }

  // Users Mehod
  const fetchUsers = async () => {
    setUsersLoading(true)

    try {
      const response = await userActions.getAll()

      setUsers(response.data)
      setUsersError(null)
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Failed to fetch users')
    } finally {
      setUsersLoading(false)
    }
  }

  const createUser = async (data: {
    email: string
    password: string
    username: string
    phone: string
    school: number
    roleUser: string
    photo?: number | null
    job?: string
    reports?: number[]
  }) => {
    try {
      // Cari school yang sesuai
      const selectedSchool = schools.find(school => school.id === data.school)

      const newUser = await userActions.create({
        ...data,
        job: data.roleUser === 'teacher' ? data.job : undefined,
        photo: data.photo,
        reports: data.reports || []
      })

      // Tambahkan user baru ke state dengan school yang lengkap
      setUsers(prev => [
        ...prev,
        {
          ...newUser,
          job: data.roleUser === 'teacher' ? data.job : undefined,
          reports: newUser.reports || [],
          photo: newUser.photo,
          school: {
            id: data.school,
            title: selectedSchool?.title || ''
          }
        }
      ])

      return newUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user'

      setUsersError(errorMessage)
      throw error
    }
  }

  const updateUser = async (data: {
    id?: number
    email: string
    username: string
    phone: string
    school: number
    roleUser: string
    blocked: boolean
    job?: string
    photo?: number | null
    reports?: number[]
  }) => {
    try {
      if (!data.id) {
        throw new Error('User ID is required for update')
      }

      const updatedUser = await userActions.update(data.id, {
        email: data.email,
        username: data.username,
        phone: data.phone,
        roleUser: data.roleUser,
        school: data.school,
        blocked: data.blocked,
        photo: data.photo,
        job: data.roleUser === 'teacher' ? data.job : undefined,
        reports: data.reports || []
      })

      // Update state dengan data yang baru dikembalikan dari API
      setUsers(prev =>
        prev.map(user =>
          user.id === data.id
            ? {
                ...user,
                ...updatedUser,
                photo: updatedUser.photo,
                school: {
                  id: data.school,
                  title: updatedUser.school?.title || ''
                }
              }
            : user
        )
      )

      // Optional: Refetch users untuk pastikan data terbaru
      await fetchUsers()
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Failed to update user')
      throw error
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await userActions.delete(id)
      setUsers(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Failed to delete user')
    }
  }

  const deleteMultipleUsers = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => userActions.delete(id)))
      setUsers(prev => prev.filter(item => !ids.includes(item.id)))
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Failed to delete users')
    }
  }

  // Reports

  const fetchReports = async () => {
    setReportsLoading(true)

    try {
      const response = await reportActions.getAll()

      setReports(response.data)
      setReportsError(null)
    } catch (error) {
      setReportsError(error instanceof Error ? error.message : 'Failed to fetch Reports')
    } finally {
      setReportsLoading(false)
    }
  }

  const createReport = async (data: {
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
    setReportsLoading(true)

    try {
      const newReport = await reportActions.create(data)

      // Tambahkan report baru ke state
      setReports(prev => [
        ...prev,
        {
          ...newReport,
          photoIncident: newReport.photoIncident,
          user: newReport.user,
          teacher: newReport.teacher
        }
      ])

      setReportsError(null)
    } catch (error) {
      setReportsError(error instanceof Error ? error.message : 'Failed to create report')
      throw error
    } finally {
      setReportsLoading(false)
    }
  }

  const updateReport = async (data: {
    id: number
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
  }) => {
    setReportsLoading(true)

    try {
      const updatedReport = await reportActions.update(data.id, data)

      // Update report di state
      setReports(prev =>
        prev.map(report =>
          report.id === data.id
            ? {
                ...report,
                ...updatedReport,
                photoIncident: updatedReport.photoIncident,
                user: updatedReport.user,
                teacher: updatedReport.teacher
              }
            : report
        )
      )

      setReportsError(null)

      return updatedReport
      setReportsError(null)
    } catch (error) {
      setReportsError(error instanceof Error ? error.message : 'Failed to update report')
      throw error
    } finally {
      setReportsLoading(false)
    }
  }

  const deleteReport = async (id: number) => {
    try {
      await reportActions.delete(id)
      setReports(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      setReportsError(error instanceof Error ? error.message : 'Failed to delete report')
    }
  }

  const deleteMultipleReports = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => reportActions.delete(id)))
      setReports(prev => prev.filter(item => !ids.includes(item.id)))
    } catch (error) {
      setReportsError(error instanceof Error ? error.message : 'Failed to delete reports')
    }
  }

  // Update contextValue untuk menyertakan schools
  const contextValue = {
    aspirations,
    aspirationsLoading,
    aspirationsError,
    fetchAspirations,
    deleteAspiration,
    deleteMultipleAspirations,

    // Reading
    readings,
    readingsLoading,
    readingsError,
    fetchReadings,
    createReadings,
    updateReadings,
    deleteReading,
    deleteMultipleReadings,

    // Users
    users,
    usersLoading,
    usersError,
    createUser,
    updateUser,
    fetchUsers,
    deleteUser,
    deleteMultipleUsers,

    // Reports
    reports,
    reportsLoading,
    reportsError,
    createReport,
    updateReport,
    deleteReport,
    deleteMultipleReports,
    fetchReports,

    // Schools
    schools,
    schoolsLoading,
    schoolsError,
    updateSchool,
    createSchool,
    fetchSchools,
    deleteSchool,
    deleteMultipleSchools
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

// Custom hook untuk menggunakan context
export const useAppContext = () => useContext(AppContext)
