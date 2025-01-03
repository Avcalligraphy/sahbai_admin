'use client'

// MUI Imports
import { useEffect } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { useAppContext } from '@/contexts/AppContext'

// Vars
// const data = [
//   {
//     title: 24,
//     subtitle: 'Clients',
//     icon: 'ri-user-3-line'
//   },
//   {
//     title: 165,
//     subtitle: 'Invoices',
//     icon: 'ri-pages-line'
//   },
//   {
//     title: '$2.46k',
//     subtitle: 'Paid',
//     icon: 'ri-wallet-line'
//   },
//   {
//     title: '$876',
//     subtitle: 'Unpaid',
//     icon: 'ri-money-dollar-circle-line'
//   }
// ]

const SchoolsCard = () => {
  // Hooks
  // const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  // const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const { schools, fetchSchools } = useAppContext()

  // Fetch schools saat komponen dimount
  useEffect(() => {
    fetchSchools()
  }, [])

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            className='sm:[&:nth-of-type(odd)>div]:pie-6 sm:[&:nth-of-type(odd)>div]:border-ie md:[&:not(:last-child)>div]:pie-6 md:[&:not(:last-child)>div]:border-ie'
          >
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <Typography variant='h4'>{schools.length}</Typography>
                <Typography>Schools</Typography>
              </div>
              <CustomAvatar color='primary' skin='light' variant='rounded' size={42}>
                <i className={classnames('text-[26px]', 'ri-school-line')} />
              </CustomAvatar>
            </div>
            {/* {isBelowMdScreen && !isBelowSmScreen && index < data.length - 2 && (
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

export default SchoolsCard
