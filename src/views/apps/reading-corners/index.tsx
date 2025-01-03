'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ReadingType } from '@/types/apps/readingTypes'

// Component Imports
import ReadingCard from './ReadingCard'
import ReadingListTable from './ReadingListTable'

const ReadingList = ({ orderData }: { orderData?: ReadingType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReadingCard />
      </Grid>
      <Grid item xs={12}>
        <ReadingListTable orderData={orderData} />
      </Grid>
    </Grid>
  )
}

export default ReadingList
