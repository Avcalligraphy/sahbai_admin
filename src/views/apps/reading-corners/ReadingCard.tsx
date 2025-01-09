'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import type { Theme } from '@mui/material/styles'

// Type Imports
import classnames from 'classnames'

import type { SessionsType } from '@/types/apps/aspirationsTypes'
import type { ReadingType } from '@/types/apps/readingTypes'

// Third-party Imports

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { useAppContext } from '@/contexts/AppContext'

const ReadingCard = ({ session }: { session: SessionsType }) => {
  const { readings, fetchReadings } = useAppContext()
  const [filteredData, setFilteredData] = useState<ReadingType[]>([])

  // Fetch schools saat komponen dimount
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

    setFilteredData(result)
  }, [readings, session])

  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            className={classnames({
              '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie': isBelowMdScreen && !isBelowSmScreen,
              '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
            })}
          >
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <Typography variant='h4'>{filteredData.length}</Typography>
                <Typography>Total Readings</Typography>
              </div>
              <CustomAvatar variant='rounded' color='primary' size={42} skin='light'>
                <i className={classnames('text-[26px]', 'ri-book-2-line')} />
              </CustomAvatar>
            </div>
            {/* {isBelowMdScreen && !isBelowSmScreen && index < orderData.length - 2 && (
              <Divider
                className={classnames('mbs-6', {
                  'mie-6': index % 2 === 0
                })}
              />
            )}
            {isBelowSmScreen && index < data.length - 1 && <Divider className='mbs-6' />} */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReadingCard
