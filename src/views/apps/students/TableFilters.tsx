'use client'

import { useState, useEffect } from 'react'

import { CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

type TableFiltersProps = {
  onFilterChange: (filters: { roleUser: string; school: string; status: string }) => void

  // Opsional: data untuk generate unique values
  tableData?: UsersType[]
}

const TableFilters = ({ onFilterChange, tableData }: TableFiltersProps) => {
  // States
  const [roleUser, setRoleUser] = useState('')
  const [school, setSchool] = useState('')
  const [status, setStatus] = useState('')

  // Unique values
  const uniqueroleUsers = tableData ? Array.from(new Set(tableData.map(user => user.roleUser).filter(Boolean))) : []

  const uniqueSchools = tableData ? Array.from(new Set(tableData.map(user => user.school?.title).filter(Boolean))) : []

  // Trigger filter change
  useEffect(() => {
    onFilterChange({ roleUser, school, status })
  }, [roleUser, school, status])

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              id='select-role'
              value={roleUser}
              onChange={e => setRoleUser(e.target.value)}
              label='Select Role'
              labelId='role-select'
            >
              <MenuItem value=''>All Role</MenuItem>
              {uniqueroleUsers.map(roleUserOption => (
                <MenuItem key={roleUserOption} value={roleUserOption}>
                  {roleUserOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='school-select'>Select School</InputLabel>
            <Select
              fullWidth
              id='select-school'
              value={school}
              onChange={e => setSchool(e.target.value)}
              label='Select School'
              labelId='school-select'
            >
              <MenuItem value=''>All Schools</MenuItem>
              {uniqueSchools.map(schoolOption => (
                <MenuItem key={schoolOption} value={schoolOption}>
                  {schoolOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Select Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              label='Select Status'
              labelId='status-select'
            >
              <MenuItem value=''>All Statuses</MenuItem>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='blocked'>Blocked</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
