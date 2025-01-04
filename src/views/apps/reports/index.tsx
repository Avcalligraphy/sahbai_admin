// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ReportsType } from '@/types/apps/reportsTypes'
import type { SessionsType } from '@/types/apps/aspirationsTypes'

// Component Imports
import ReportsCard from './ReportsCard'
import ReportsListTable from './ReportsListTable'

const ReportsList = ({ invoiceData, session }: { invoiceData?: ReportsType[]; session: SessionsType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReportsCard session={session} />
      </Grid>
      <Grid item xs={12}>
        <ReportsListTable invoiceData={invoiceData} session={session} />
      </Grid>
    </Grid>
  )
}

export default ReportsList
