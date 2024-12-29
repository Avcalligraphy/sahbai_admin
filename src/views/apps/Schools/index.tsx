// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'

import SchoolsCard from './SchoolsCard'
import SchoolsListTable from './SchoolsListTable'

const SchoolsList = ({ invoiceData }: { invoiceData?: InvoiceType[] }) => {
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
