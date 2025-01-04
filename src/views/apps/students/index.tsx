// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import type { SessionsType } from '@/types/apps/aspirationsTypes'

// Component Imports
import StudentsListTable from './StudentsListTable'
import StudentsListCards from './StudentsListCards'

const StudentsList = ({ userData, session }: { userData?: UsersType[]; session: SessionsType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StudentsListCards session={session} />
      </Grid>
      <Grid item xs={12}>
        <StudentsListTable tableData={userData} session={session} />
      </Grid>
    </Grid>
  )
}

export default StudentsList
