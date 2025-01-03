'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

import Swal from 'sweetalert2'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
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
import type { Locale } from '@configs/i18n'
import type { SchoolsType } from '@/types/apps/schoolsTypes'

// Component Imports
import OptionMenu from '@core/components/option-menu'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import AddSchool from './AddSchool'

import { useAppContext } from '@/contexts/AppContext'
import { exportSchoolsToExcel } from '@/libs/excel'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type SchoolsTypeWithAction = SchoolsType & {
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
const columnHelper = createColumnHelper<SchoolsTypeWithAction>()

const SchoolsListTable = ({ invoiceData }: { invoiceData?: SchoolsType[] }) => {
  const { schools, deleteSchool, deleteMultipleSchools } = useAppContext()

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<SchoolsType | undefined>(undefined)

  // Handler untuk membuka drawer create
  const handleOpenCreateDrawer = () => {
    setSelectedSchool(undefined)
    setIsDrawerOpen(true)
  }

  const handleExport = async () => {
    await exportSchoolsToExcel(schools)
  }

  // Handler untuk membuka drawer update
  const handleOpenUpdateDrawer = (school: SchoolsType) => {
    setSelectedSchool(school)
    setIsDrawerOpen(true)
  }

  // Filter data berdasarkan global filter dan status
  const filteredData = useMemo(() => {
    return schools.filter(school => {
      // Filter berdasarkan global search
      const matchesGlobalFilter = globalFilter
        ? Object.values(school).some(value => String(value).toLowerCase().includes(globalFilter.toLowerCase()))
        : true

      // Filter berdasarkan status
      const matchesStatus = status ? school.schoolsStatus.toLowerCase().replace(/\s+/g, '-') === status : true

      return matchesGlobalFilter && matchesStatus
    })
  }, [schools, globalFilter, status])

  // Handler Delete Single
  const handleDelete = async (schoolId: number) => {
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
        await deleteSchool(schoolId)

        Swal.fire({
          title: 'Deleted!',
          text: 'Your school has been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete school:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the school.',
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
        await deleteMultipleSchools(selectedIds)

        // Reset row selection
        table.resetRowSelection()

        Swal.fire({
          title: 'Deleted!',
          text: 'Selected schools have been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete selected schools', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting schools.',
        icon: 'error'
      })
    }
  }

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<SchoolsTypeWithAction, any>[]>(
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
      columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.address}</Typography>
      }),
      columnHelper.accessor('users_permissions_users', {
        header: 'Students',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.users_permissions_users?.data?.length || '0'}</Typography>
        )
      }),
      columnHelper.accessor('teachers', {
        header: 'Teachers',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.teachers?.data?.length || '0'}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleDelete(row.original.id)}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleOpenUpdateDrawer(row.original)}>
              <i className='ri-pencil-line text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'ri-download-line',
                  menuItemProps: { className: 'flex items-center gap-2' }
                },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  href: getLocalizedUrl(`/apps/invoice/edit/${row.original.id}`, locale as Locale),
                  linkProps: {
                    className: 'flex items-center is-full plb-2 pli-5 gap-2'
                  }
                },
                {
                  text: 'Duplicate',
                  icon: 'ri-file-copy-line',
                  menuItemProps: { className: 'flex items-center gap-2' }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoiceData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as SchoolsType[],
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

  // useEffect(() => {
  //   const filteredData = data?.filter(schools => {
  //     if (status && schools.status.toLowerCase().replace(/\s+/g, '-') !== status) return false

  //     return true
  //   })

  //   setFilteredData(filteredData)
  // }, [status, data, setFilteredData])

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
              Add School
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
              placeholder='Search Schools'
              className='is-full sm:is-auto min-is-[250px]'
            />
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
      <AddSchool
        open={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}
        initialData={selectedSchool} // Kirim data school jika update
      />
    </>
  )
}

export default SchoolsListTable
