'use client'

// MUI Imports
import { useEffect } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

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

const AspirationsCard = () => {
  const { aspirations, fetchAspirations } = useAppContext()

  // Fetch schools saat komponen dimount
  useEffect(() => {
    fetchAspirations()
  }, [])

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
                <Typography variant='h4'>{aspirations.length}</Typography>
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
