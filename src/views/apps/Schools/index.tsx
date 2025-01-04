// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { SchoolsType } from '@/types/apps/schoolsTypes'

import SchoolsCard from './SchoolsCard'
import SchoolsListTable from './SchoolsListTable'

const SchoolsList = ({ invoiceData }: { invoiceData?: SchoolsType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SchoolsCard />
      </Grid>
      <Grid item xs={12}>
        <SchoolsListTable invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default SchoolsList
