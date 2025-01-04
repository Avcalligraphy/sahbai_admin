'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ReadingType } from '@/types/apps/readingTypes'

// Component Imports
import ReadingCard from './ReadingCard'
import ReadingListTable from './ReadingListTable'

// Type Imports
import type { SessionsType } from '@/types/apps/aspirationsTypes'

const ReadingList = ({ orderData, session }: { orderData?: ReadingType[]; session: SessionsType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReadingCard session={session} />
      </Grid>
      <Grid item xs={12}>
        <ReadingListTable orderData={orderData} session={session} />
      </Grid>
    </Grid>
  )
}

export default ReadingList
