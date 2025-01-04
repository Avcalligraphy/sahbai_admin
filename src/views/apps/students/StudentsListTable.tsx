'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

import Swal from 'sweetalert2'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

// import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import type { SessionsType } from '@/types/apps/aspirationsTypes'

import { useAppContext } from '@/contexts/AppContext'
import { exportUsersToExcel } from '@/libs/excel'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
  action?: string
}

// type UserroleUserType = {
//   [key: string]: { icon: string; color: string }
// }

type UserRoleType = {
  [key: string]: { icon: string; color: string }
} & { default: { icon: string; color: string } }

const userRoleObj: UserRoleType = {
  teacher: { icon: 'ri-team-line', color: 'success' },
  user: { icon: 'ri-user-3-line', color: 'primary' },
  school: { icon: 'ri-school-line', color: 'primary' },
  admin: { icon: 'ri-school-line', color: 'primary' },
  default: { icon: 'ri-user-line', color: 'secondary' }
}

type UserStatusType = {
  [key: string]: ThemeColor
}

// Styled Components
const Icon = styled('i')({})

// Styled Components
// const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
// const userroleUserObj: UserroleUserType = {
//   admin: { icon: 'ri-vip-crown-line', color: 'error' },
//   author: { icon: 'ri-computer-line', color: 'warning' },
//   editor: { icon: 'ri-edit-box-line', color: 'info' },
//   maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
//   subscriber: { icon: 'ri-user-3-line', color: 'primary' }
// }

const userStatusObj: UserStatusType = {
  true: 'error',
  false: 'success'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const StudentsListTable = ({ tableData, session }: { tableData?: UsersType[]; session: SessionsType }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UsersType | undefined>(undefined)
  const [filteredData, setFilteredData] = useState<UsersType[]>([])

  const handleOpenCreateDrawer = () => {
    setSelectedUser(undefined)
    setIsDrawerOpen(true)
  }

  const handleOpenUpdateDrawer = (user: UsersType) => {
    setSelectedUser(user)
    setIsDrawerOpen(true)
  }

  const [filters, setFilters] = useState({
    roleUser: '',
    school: '',
    status: ''
  })

  // Gunakan context
  const { users, fetchUsers, deleteUser, deleteMultipleUsers } = useAppContext()

  const handleExport = async () => {
    await exportUsersToExcel(filteredData)
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtered data
  // const filteredData = useMemo(() => {
  //   return users.filter(user => {
  //     // Exclude admin dan school roles
  //     if (user.roleUser === 'admin' || user.roleUser === 'school') {
  //       return false
  //     }

  //     // Filter roleUser dengan pengecualian
  //     const matchesroleUser = filters.roleUser
  //       ? user.roleUser === filters.roleUser && !['admin', 'school'].includes(user.roleUser)
  //       : true

  //     // Filter school
  //     const matchesSchool = filters.school ? user.school?.title === filters.school : true

  //     // Filter status
  //     const matchesStatus = filters.status ? (filters.status === 'active' ? !user.blocked : user.blocked) : true

  //     return matchesroleUser && matchesSchool && matchesStatus
  //   })
  // }, [users, filters])

  useEffect(() => {
    // Pastikan tableData tersedia
    if (!users) return

    // Filter berdasarkan role
    let result = users

    // Jika role school, filter berdasarkan sekolah user
    if (session?.user?.role === 'school') {
      result = result.filter(
        user => user.school?.title === session?.user?.name && user.roleUser !== 'admin' && user.roleUser !== 'school'
      )
    } else {
      // Untuk role lain, exclude admin dan school
      result = result.filter(user => user.roleUser !== 'admin' && user.roleUser !== 'school')
    }

    // Filter berdasarkan roleUser
    if (filters.roleUser) {
      result = result.filter(user => user.roleUser === filters.roleUser && !['admin', 'school'].includes(user.roleUser))
    }

    // Filter berdasarkan sekolah
    if (filters.school) {
      result = result.filter(user => user.school?.title === filters.school)
    }

    // Filter berdasarkan status
    if (filters.status) {
      result = result.filter(user => (filters.status === 'active' ? !user.blocked : user.blocked))
    }

    // Filter berdasarkan global search
    if (globalFilter) {
      const searchValue = globalFilter.toLowerCase()

      result = result.filter(user =>
        Object.values(user).some(value => String(value).toLowerCase().includes(searchValue))
      )
    }

    setFilteredData(result)
  }, [users, session, filters, globalFilter])

  // Delete handlers (sama seperti sebelumnya)
  const handleDelete = async (userId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0E632F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        await deleteUser(userId)

        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the user.',
        icon: 'error'
      })
    }
  }

  const handleDeleteSelected = async () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id)

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0E632F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        await deleteMultipleUsers(selectedIds)
        table.resetRowSelection()

        Swal.fire({
          title: 'Deleted!',
          text: 'Selected users have been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete selected users', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting users.',
        icon: 'error'
      })
    }
  }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('id', {
        header: 'No',
        cell: ({ row, table }) => {
          // Hitung nomor berdasarkan halaman dan index
          const pageIndex = table.getState().pagination.pageIndex
          const pageSize = table.getState().pagination.pageSize
          const rowIndex = row.index

          // Hitung nomor urut
          const serialNumber = pageIndex * pageSize + rowIndex + 1

          return <Typography color='primary'>{serialNumber}</Typography>
        }
      }),
      columnHelper.accessor('username', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomAvatar skin='light' size={34}>
              {getInitials(row.original.username)}
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.username}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.phone}
          </Typography>
        )
      }),
      columnHelper.accessor('school', {
        header: 'school',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.school?.title}
          </Typography>
        )
      }),
      columnHelper.accessor('roleUser', {
        header: 'role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon
              className={classnames('text-[22px]', userRoleObj[row.original.roleUser || 'default'].icon)}
              sx={{
                color: `var(--mui-palette-${userRoleObj[row.original.roleUser || 'default'].color}-main)`
              }}
            />
            <Typography className='capitalize' color='text.primary'>
              {row.original.roleUser}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('blocked', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              label={row.original.blocked ? 'Blocked' : 'Active'}
              size='small'
              color={userStatusObj[row.original.blocked === true ? 'true' : 'false']}
              className='capitalize'
            />
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleDelete(row.original.id)}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleOpenUpdateDrawer(row.original)}>
              <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as UsersType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <TableFilters onFilterChange={setFilters} tableData={users} />
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line' />}
            className='is-full sm:is-auto'
            onClick={handleExport}
          >
            Export
          </Button>
          {Object.keys(rowSelection).length > 0 && (
            <Button
              variant='contained'
              onClick={handleDeleteSelected}
              startIcon={<i className='ri-delete-bin-7-line' />}
            >
              Delete {Object.keys(rowSelection).length} Selected
            </Button>
          )}
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 is-full flex-col sm:is-auto sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='is-full sm:is-auto'
            />
            <Button variant='contained' onClick={handleOpenCreateDrawer} className='is-full sm:is-auto'>
              Add New User
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddUserDrawer
        open={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}
        initialData={selectedUser} // Kirim data school jika update
        role={session?.user?.role || 'admin'}
        schoolName={session?.user?.name || 'Unknown'}
      />
    </>
  )
}

export default StudentsListTable
