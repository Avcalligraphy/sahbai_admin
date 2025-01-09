// React Imports
import { useState, useEffect, useMemo } from 'react'

import Swal from 'sweetalert2'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material'

// import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
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

// import type { OrderType } from '@/types/apps/ecommerceTypes'
// import type { Locale } from '@configs/i18n'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import type { ReadingType } from '@/types/apps/readingTypes'
import type { SessionsType } from '@/types/apps/aspirationsTypes'

import { useAppContext } from '@/contexts/AppContext'
import AddReading from './AddReading'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type PayementStatusType = {
  text: string
  color: ThemeColor
}

type StatusChipColorType = {
  color: ThemeColor
}

export const paymentStatus: { [key: number]: PayementStatusType } = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

// type ECommerceOrderTypeWithAction = OrderType & {
//   action?: string
// }

type ReadingTypeWithAction = ReadingType & {
  action?: string
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

// Column Definitions
const columnHelper = createColumnHelper<ReadingTypeWithAction>()

const ReadingListTable = ({ orderData, session }: { orderData?: ReadingType[]; session: SessionsType }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<ReadingType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedWritter, setSelectedWritter] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedReading, setSelectedReading] = useState<ReadingType | undefined>(undefined)

  // const [selectedReport, setSelectedReport] = useState<ReadingType | undefined>(undefined)

  const { readings, fetchReadings, deleteReading, deleteMultipleReadings } = useAppContext()

  const handleOpenCreateDrawer = () => {
    setSelectedReading(undefined)
    setIsDrawerOpen(true)
  }

  const handleOpenUpdateDrawer = (reading: ReadingType) => {
    setSelectedReading(reading)
    setIsDrawerOpen(true)
  }

  useEffect(() => {
    fetchReadings()
  }, [])

  // Filter data berdasarkan role dan kondisi lainnya
  useEffect(() => {
    // Pastikan orderData tersedia
    if (!readings) return

    // Filter berdasarkan role
    let result = readings

    // Jika bukan admin, filter berdasarkan sekolah user
    if (session?.user?.role === 'school') {
      result = result.filter(reading => reading.school?.data?.attributes?.title === session?.user?.name)
    }

    // Filter berdasarkan sekolah yang dipilih
    if (selectedWritter) {
      result = result.filter(reading => reading.writter === selectedWritter)
    }

    // Filter berdasarkan global search
    if (globalFilter) {
      const searchValue = globalFilter.toLowerCase()

      result = result.filter(aspiration =>
        Object.values(aspiration).some(value => String(value).toLowerCase().includes(searchValue))
      )
    }

    setFilteredData(result)
  }, [orderData, session, selectedWritter, globalFilter, readings])

  // Unique schools for filter
  const uniqueWritters = useMemo(() => {
    return Array.from(new Set(filteredData.map(reading => reading.writter || 'Unknown')))
  }, [filteredData])

  // Delete Aspiration
  const handleDelete = async (readingId: number) => {
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
        await deleteReading(readingId)

        Swal.fire({
          title: 'Deleted!',
          text: 'Your reading has been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete reading:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the reading.',
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
        await deleteMultipleReadings(selectedIds)

        // Reset row selection
        table.resetRowSelection()

        Swal.fire({
          title: 'Deleted!',
          text: 'Selected readings have been deleted.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Failed to delete selected readings', error)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting readings.',
        icon: 'error'
      })
    }
  }

  const columns = useMemo<ColumnDef<ReadingType, any>[]>(
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
      columnHelper.accessor('image', {
        header: 'Image',
        cell: ({ row }) => {
          // Ambil username dari nested data
          const image = row.original.image?.data?.attributes?.url

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
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => <Typography>{row.original.title}</Typography>
      }),

      columnHelper.accessor('writter', {
        header: 'Writter',
        cell: ({ row }) => <Typography className='line-clamp-2'>{row.original.writter}</Typography>
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => (
          <Typography>
            {row.original?.updatedAt ? new Date(row.original.updatedAt).toLocaleDateString() : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton
              size='small'
              onClick={() => {
                if (row.original?.id !== undefined) {
                  handleDelete(row.original.id)
                } else {
                  console.warn('ID is undefined, cannot delete.')
                }
              }}
            >
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
    [orderData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as ReadingType[],
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

  // const getAvatar = (params: Pick<OrderType, 'avatar' | 'customer'>) => {
  //   const { avatar, customer } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(customer as string)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center'>
          <div className='flex items-center flex-col sm:flex-row is-full sm:is-auto gap-4'>
            <Button
              variant='contained'
              startIcon={<i className='ri-add-line' />}
              className='is-full sm:is-auto'
              onClick={handleOpenCreateDrawer}
            >
              Add Reading
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
              placeholder='Search Readings'
              className='is-full sm:is-auto min-is-[250px]'
            />
            <FormControl fullWidth size='small' className='min-is-[175px]'>
              <InputLabel id='writter-select'>Writter</InputLabel>
              <Select
                fullWidth
                id='writter-school'
                value={selectedWritter}
                onChange={e => setSelectedWritter(e.target.value)}
                label='Writter'
                labelId='writter-select'
              >
                <MenuItem value=''>All Writters</MenuItem>
                {uniqueWritters.map(writter => (
                  <MenuItem key={writter} value={writter}>
                    {writter}
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
          rowsPerPageOptions={[10, 25, 50, 100]}
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
      <AddReading
        open={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}
        initialData={selectedReading}
        role={session?.user?.role || 'admin'}
        schoolName={session?.user?.name || 'Unknown'}
      />
    </>
  )
}

export default ReadingListTable
