// @/context/AppContext.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'

// Import semua tipe yang dibutuhkan
import type { AspirationsType } from '@/types/apps/aspirationsTypes'
import type { SchoolsType } from '@/types/apps/schoolsTypes'
import { aspirationActions, schoolActions } from '@/libs/actions/actions'

// Import semua actions

// Extend AppContextType untuk menambahkan Schools
type AppContextType = {
  // Aspirations
  aspirations: AspirationsType[]
  aspirationsLoading: boolean
  aspirationsError: string | null
  fetchAspirations: () => Promise<void>
  deleteAspiration: (id: number) => Promise<void>
  deleteMultipleAspirations: (ids: number[]) => Promise<void>

  // Schools (Tambahan)
  schools: SchoolsType[]
  schoolsLoading: boolean
  schoolsError: string | null
  fetchSchools: () => Promise<void>
  deleteSchool: (id: number) => Promise<void>
  deleteMultipleSchools: (ids: number[]) => Promise<void>
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

  // Schools defaults (Tambahan)
  schools: [],
  schoolsLoading: false,
  schoolsError: null,
  fetchSchools: async () => {},
  deleteSchool: async () => {},
  deleteMultipleSchools: async () => {}
})

// Provider Component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State untuk Aspirations
  const [aspirations, setAspirations] = useState<AspirationsType[]>([])
  const [aspirationsLoading, setAspirationsLoading] = useState(false)
  const [aspirationsError, setAspirationsError] = useState<string | null>(null)

  // Tambahkan state untuk Schools
  const [schools, setSchools] = useState<SchoolsType[]>([])
  const [schoolsLoading, setSchoolsLoading] = useState(false)
  const [schoolsError, setSchoolsError] = useState<string | null>(null)

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

  // Update contextValue untuk menyertakan schools
  const contextValue = {
    aspirations,
    aspirationsLoading,
    aspirationsError,
    fetchAspirations,
    deleteAspiration,
    deleteMultipleAspirations,

    // Schools
    schools,
    schoolsLoading,
    schoolsError,
    fetchSchools,
    deleteSchool,
    deleteMultipleSchools
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

// Custom hook untuk menggunakan context
export const useAppContext = () => useContext(AppContext)
