'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { AspirationsType, SessionsType } from '@/types/apps/aspirationsTypes'

// Component Imports
import AspirationsCard from './AspirationsCard'
import AspirationsListTable from './AspirationsListTable'

const AspirationsList = ({ orderData, session }: { orderData?: AspirationsType[]; session: SessionsType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AspirationsCard session={session} />
      </Grid>
      <Grid item xs={12}>
        <AspirationsListTable orderData={orderData} session={session} />
      </Grid>
    </Grid>
  )
}

export default AspirationsList
