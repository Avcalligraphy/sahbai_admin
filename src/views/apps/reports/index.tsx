// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ReportsType } from '@/types/apps/reportsTypes'

// Component Imports
import ReportsCard from './ReportsCard'
import ReportsListTable from './ReportsListTable'

const ReportsList = ({ invoiceData }: { invoiceData?: ReportsType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReportsCard />
      </Grid>
      <Grid item xs={12}>
        <ReportsListTable invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default ReportsList
