'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

import Swal from 'sweetalert2'

// MUI Imports

import { Button, Checkbox } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
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
import type { AspirationsType } from '@/types/apps/aspirationsTypes'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { useAppContext } from '@/contexts/AppContext'
import { exportAspirationsToExcel } from '@/libs/excel'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type AspirationsTypeWithAction = AspirationsType & {
  action?: string
}

// type InvoiceStatusObj = {
//   [key: string]: {
//     icon: string
//     color: ThemeColor
//   }
// }

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
// const invoiceStatusObj: InvoiceStatusObj = {
//   Sent: { color: 'secondary', icon: 'ri-send-plane-2-line' },
//   Paid: { color: 'success', icon: 'ri-check-line' },
//   Draft: { color: 'primary', icon: 'ri-mail-line' },
//   'Partial Payment': { color: 'warning', icon: 'ri-pie-chart-2-line' },
//   'Past Due': { color: 'error', icon: 'ri-information-line' },
//   Downloaded: { color: 'info', icon: 'ri-arrow-down-line' }
// }

// Column Definitions
const columnHelper = createColumnHelper<AspirationsTypeWithAction>()

const AspirationsListTable = ({ orderData }: { orderData?: AspirationsType[] }) => {
  // States
  // const [status, setStatus] = useState<AspirationsType['aspirationsStatus']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<AspirationsType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<string>('')

  const { aspirations, fetchAspirations, deleteAspiration, deleteMultipleAspirations } = useAppContext()

  // Fetch aspirations on component mount
  useEffect(() => {
    fetchAspirations()
  }, [])
  useEffect(() => {
    const filtered = aspirations.filter(aspiration => {
      // Filter berdasarkan sekolah
      if (selectedSchool && aspiration.school.data?.attributes?.title !== selectedSchool) return false

      // Filter berdasarkan global search
      if (globalFilter) {
        const searchValue = globalFilter.toLowerCase()

        return Object.values(aspiration).some(value => String(value).toLowerCase().includes(searchValue))
      }

      return true
    })

    setFilteredData(filtered)
  }, [aspirations, selectedSchool, globalFilter])

  // Unique schools for filter
  const uniqueSchools = useMemo(() => {
    return Array.from(new Set(aspirations.map(aspiration => aspiration.school.data?.attributes?.title || 'Unknown')))
  }, [aspirations])

  const handleExport = async () => {
    await exportAspirationsToExcel(aspirations)
  }

  // Delete Aspiration
  const handleDelete = async (aspirationId: number) => {
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
        // Panggil method delete dari context
        await deleteAspiration(aspirationId)

        Swal.fire({
          title: 'Deleted!',
          text: 'Your aspiration has been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete aspiration:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the aspiration.',
        icon: 'error'
      })
    }
  }

  // Delete Multiple Aspirations
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
        // Proses delete multiple menggunakan context
        await deleteMultipleAspirations(selectedIds)

        // Reset row selection
        table.resetRowSelection()

        Swal.fire({
          title: 'Deleted!',
          text: 'Selected aspirations have been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete selected aspirations', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting aspirations.',
        icon: 'error'
      })
    }
  }

  const columns = useMemo<ColumnDef<AspirationsTypeWithAction, any>[]>(
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
      columnHelper.accessor('title', {
        header: 'Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.title}</Typography>
      }),
      columnHelper.accessor('users_permissions_user', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomAvatar skin='light' size={34}>
              {getInitials(row.original.users_permissions_user?.data?.attributes?.username || 'Unknown')}
            </CustomAvatar>
            <Typography>{row.original.users_permissions_user?.data?.attributes?.username || 'Unknown'}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Descriptions',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.description}</Typography>
      }),
      columnHelper.accessor('school', {
        header: 'Schools',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.school.data?.attributes?.title || 'Unknown'}</Typography>
        )
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => (
          <Typography color='text.primary'>{new Date(row.original.updatedAt).toLocaleDateString()}</Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleDelete(row.original.id)}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as AspirationsType[],
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
    <Card>
      <CardContent className={`flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center`}>
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
            placeholder='Search Aspirations'
            className='is-full sm:is-auto min-is-[250px]'
          />
          <FormControl fullWidth size='small' className='min-is-[175px]'>
            <InputLabel id='school-select'>School</InputLabel>
            <Select
              fullWidth
              id='select-school'
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              label='School'
              labelId='school-select'
            >
              <MenuItem value=''>All Schools</MenuItem>
              {uniqueSchools.map(school => (
                <MenuItem key={school} value={school}>
                  {school}
                </MenuItem>
              ))}
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
  )
}

export default AspirationsListTable
