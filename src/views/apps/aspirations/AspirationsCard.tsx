'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SessionsType, AspirationsType } from '@/types/apps/aspirationsTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

import { useAppContext } from '@/contexts/AppContext'

// Vars
// const data = [
//   {
//     value: 56,
//     title: 'Pending Payment',
//     icon: 'ri-calendar-2-line'
//   },
//   {
//     value: 12689,
//     title: 'Completed',
//     icon: 'ri-check-double-line'
//   },
//   {
//     value: 124,
//     title: 'Refunded',
//     icon: 'ri-wallet-3-line'
//   },
//   {
//     value: 32,
//     title: 'Failed',
//     icon: 'ri-error-warning-line'
//   }
// ]

const AspirationsCard = ({ session }: { session: SessionsType }) => {
  const { aspirations, fetchAspirations } = useAppContext()

  const [filteredData, setFilteredData] = useState<AspirationsType[]>([])

  // Fetch schools saat komponen dimount
  useEffect(() => {
    fetchAspirations()
  }, [])

  // Filter data berdasarkan role dan kondisi lainnya
  useEffect(() => {
    // Pastikan orderData tersedia
    if (!aspirations) return

    // Filter berdasarkan role
    let result = aspirations

    // Jika bukan admin, filter berdasarkan sekolah user
    if (session?.user?.role === 'school') {
      result = result.filter(aspiration => aspiration.school.data?.attributes?.title === session?.user?.name)
    }

    setFilteredData(result)
  }, [aspirations, session])

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
                <Typography>Total Aspirations</Typography>
              </div>
              <CustomAvatar variant='rounded' color='primary' size={42} skin='light'>
                <i className={classnames('text-[26px]', 'ri-apps-line')} />
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

export default AspirationsCard
