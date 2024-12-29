// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import StudentsListTable from './StudentsListTable'
import StudentsListCards from './StudentsListCards'

const StudentsList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StudentsListCards />
      </Grid>
      <Grid item xs={12}>
        <StudentsListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default StudentsList
