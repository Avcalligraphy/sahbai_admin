'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'

// import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'

// import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

import Swal from 'sweetalert2'

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
// import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import type { ThemeColor } from '@core/types'
import type { ReportsType } from '@/types/apps/reportsTypes'
import type { SessionsType } from '@/types/apps/aspirationsTypes'

import { useAppContext } from '@/contexts/AppContext'
import AddReport from './AddReport'
import { exportReportsToExcel } from '@/libs/excel'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ReportsTypeWithAction = ReportsType & {
  action?: string
}

type StatusChipColorType = {
  color?: ThemeColor
  icon?: string
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Submitted: { color: 'secondary', icon: 'ri-send-plane' },
  'Under Review': { color: 'warning', icon: 'ri-search-line' },
  'In Progress': { color: 'info', icon: 'ri-progress-line' },
  Pending: { color: 'primary', icon: 'ri-time-line' },
  Resolved: { color: 'success', icon: 'ri-check-line' },
  Rejected: { color: 'error', icon: 'ri-close-line' }
}

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

const Icon = styled('i')({})

// Column Definitions
const columnHelper = createColumnHelper<ReportsTypeWithAction>()

const ReportsListTable = ({ invoiceData, session }: { invoiceData?: ReportsType[]; session: SessionsType }) => {
  const { reports, deleteReport, deleteMultipleReports, fetchReports } = useAppContext()

  // States
  // const [status, setStatus] = useState<InvoiceType['invoiceStatus']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [filteredData, setFilteredData] = useState<ReportsType[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportsType | undefined>(undefined)

  // Fetch aspirations on component mount
  useEffect(() => {
    fetchReports()
  }, [])

  // Filter data berdasarkan role dan kondisi lainnya
  useEffect(() => {
    // Pastikan orderData tersedia
    if (!reports) return

    // Filter berdasarkan role
    let result = reports

    // Jika bukan admin, filter berdasarkan sekolah user
    if (session?.user?.role === 'school') {
      result = result.filter(report => report.school.data?.attributes?.title === session?.user?.name)
    }

    if (session?.user?.role === 'teacher') {
      result = result.filter(report => report.user?.data?.attributes?.username === session?.user?.name)
    }

    // Filter berdasarkan sekolah yang dipilih
    if (selectedTeacher) {
      result = result.filter(report => report.user?.data?.attributes?.username === selectedTeacher)
    }

    // Filter berdasarkan sekolah yang dipilih
    if (selectedStatus) {
      result = result.filter(report => report.status === selectedStatus)
    }

    // Filter berdasarkan global search
    if (globalFilter) {
      const searchValue = globalFilter.toLowerCase()

      result = result.filter(reading =>
        Object.values(reading).some(value => String(value).toLowerCase().includes(searchValue))
      )
    }

    setFilteredData(result)
  }, [invoiceData, session, selectedTeacher, globalFilter, selectedStatus, reports])

  // Unique schools for filter
  const uniqueTeachers = useMemo(() => {
    return Array.from(new Set(filteredData.map(report => report.user?.data?.attributes?.username || 'Unknown')))
  }, [filteredData])

  const handleOpenCreateDrawer = () => {
    setSelectedReport(undefined)
    setIsDrawerOpen(true)
  }

  const handleExport = async () => {
    await exportReportsToExcel(filteredData)
  }

  // Handler untuk membuka drawer update
  const handleOpenUpdateDrawer = (report: ReportsType) => {
    setSelectedReport(report)
    setIsDrawerOpen(true)
  }

  // Handler Delete Single

  const handleDelete = async (reportId: number) => {
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
        // Gunakan method delete dari context
        await deleteReport(reportId)

        Swal.fire({
          title: 'Deleted!',
          text: 'Your report has been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete report:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the report.',
        icon: 'error'
      })
    }
  }

  // Handler Delete Multiple
  const handleDeleteSelected = async () => {
    // Ambil ID yang dipilih
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
        // Gunakan method delete multiple dari context
        await deleteMultipleReports(selectedIds)

        // Reset row selection
        table.resetRowSelection()

        Swal.fire({
          title: 'Deleted!',
          text: 'Selected reports have been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete selected reports', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting schools.',
        icon: 'error'
      })
    }
  }

  const columns = useMemo<ColumnDef<ReportsTypeWithAction, any>[]>(
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
      columnHelper.accessor('photoIncident', {
        header: 'Image',
        cell: ({ row }) => {
          // Ambil username dari nested data
          const image = row.original.photoIncident?.data?.attributes?.url

          return (
            <div className='flex items-center gap-3'>
              {image ? (
                <img
                  src={process.env.NEXT_PUBLIC_STRAPI_URL + image}
                  width={38}
                  height={38}
                  className='rounded-md bg-actionHover'
                />
              ) : (
                <CustomAvatar skin='light' size={34}>
                  {getInitials('Unknown')}
                </CustomAvatar>
              )}
            </div>
          )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          // Ambil konfigurasi status, default ke objek kosong jika tidak ditemukan
          const statusConfig = statusChipColor[row.original.status] || {
            color: 'primary',
            icon: 'ri-help-line'
          }

          return (
            <div className='flex items-center gap-2'>
              <Icon
                className={classnames('text-[22px]', statusConfig.icon)}
                sx={{ color: `var(--mui-palette-${statusConfig.color}-main)` }}
              />
              <Chip label={row.original.status} color={statusConfig.color as any} variant='tonal' size='small' />
            </div>
          )
        }
      }),
      columnHelper.accessor('victimName', {
        header: 'Victim',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.victimName}
              </Typography>
              <Typography variant='body2'>{row.original.victimClass}</Typography>
              <Typography variant='body2'>{row.original.victimGender}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('perpetratorName', {
        header: 'Perpetrator',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.perpetratorName}
              </Typography>
              <Typography variant='body2'>{row.original.perpetratorClass}</Typography>
              <Typography variant='body2'>{row.original.perpetratorGender}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('dateIncident', {
        header: 'Issued Date',
        cell: ({ row }) => <Typography>{row.original.dateIncident}</Typography>
      }),
      columnHelper.accessor('timeIncident', {
        header: 'Incident Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.timeIncident}
            </Typography>
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
            <IconButton size='small'>
              <IconButton size='small' onClick={() => handleOpenUpdateDrawer(row.original)}>
                <i className='ri-pencil-line text-textSecondary' />
              </IconButton>
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoiceData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as ReportsType[],
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

  //   const getAvatar = (params: Pick<InvoiceType, 'avatar' | 'name'>) => {
  //     // Vars
  //     const { avatar, name } = params

  //     if (avatar) {
  //       return <CustomAvatar src={avatar} skin='light' size={34} />
  //     } else {
  //       return (
  //         <CustomAvatar skin='light' size={34}>
  //           {getInitials(name as string)}
  //         </CustomAvatar>
  //       )
  //     }
  //   }

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center'>
          <div className='flex items-center flex-col sm:flex-row is-full sm:is-auto gap-4'>
            <Button
              color='secondary'
              variant='outlined'
              startIcon={<i className='ri-upload-2-line' />}
              className='is-full sm:is-auto'
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='ri-add-line' />}
              className='is-full sm:is-auto'
              onClick={handleOpenCreateDrawer}
            >
              Add Report
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
          </div>
          <div className='flex items-center flex-col sm:flex-row is-full sm:is-auto gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Report'
              className='is-full sm:is-auto min-is-[250px]'
            />
            <FormControl fullWidth size='small' className='min-is-[175px]'>
              <InputLabel id='teacher-select'>Teacher</InputLabel>
              <Select
                fullWidth
                id='select-teacher'
                value={selectedTeacher}
                onChange={e => setSelectedTeacher(e.target.value)}
                label='Teacher'
                labelId='teacher-select'
              >
                <MenuItem value=''>All Teachers</MenuItem>
                {uniqueTeachers.map(teacher => (
                  <MenuItem key={teacher} value={teacher}>
                    {teacher}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size='small' className='min-is-[175px]'>
              <InputLabel id='status-select'>Status</InputLabel>
              <Select
                fullWidth
                id='select-status'
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                label='Status'
                labelId='status-select'
              >
                <MenuItem value=''>All Status</MenuItem>
                <MenuItem value='Submitted'>Submitted</MenuItem>
                <MenuItem value='Under Review'>Under Review</MenuItem>
                <MenuItem value='In Progress'>In Progress</MenuItem>
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Resolved'>Resolved</MenuItem>
                <MenuItem value='Rejected'>Rejected</MenuItem>
              </Select>
            </FormControl>
          </div>
        </CardContent>
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
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddReport open={isDrawerOpen} handleClose={() => setIsDrawerOpen(false)} initialData={selectedReport} />
    </>
  )
}

export default ReportsListTable
