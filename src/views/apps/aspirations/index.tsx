'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { AspirationsType } from '@/types/apps/aspirationsTypes'

// Component Imports
import AspirationsCard from './AspirationsCard'
import AspirationsListTable from './AspirationsListTable'

const AspirationsList = ({ orderData }: { orderData?: AspirationsType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AspirationsCard orderData={orderData} />
      </Grid>
      <Grid item xs={12}>
        <AspirationsListTable orderData={orderData} />
      </Grid>
    </Grid>
  )
}

export default AspirationsList
