// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'

// Component Imports
import ReportsCard from './ReportsCard'
import ReportsListTable from './ReportsListTable'

const ReportsList = ({ invoiceData }: { invoiceData?: InvoiceType[] }) => {
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
