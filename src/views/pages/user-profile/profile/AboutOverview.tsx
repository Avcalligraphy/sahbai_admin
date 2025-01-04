// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { Chip } from '@mui/material'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Type Imports
import type { ProfileTabType } from '@/types/pages/profileTypes'

// Definisi tipe untuk item dengan icon
type ProfileItem = {
  title: string
  value: string
  icon?: string
}

const renderList = (items: ProfileItem[]) => {
  return items.map((item, index) => (
    <div key={index} className='flex items-center gap-4'>
      {item.icon && (
        <i
          className={item.icon}
          style={{
            color: 'var(--mui-palette-primary-main)',
            fontSize: '1.25rem'
          }}
        />
      )}
      <div className='flex flex-col'>
        <Typography className='font-medium' variant='body2' color='text.primary' fontWeight={600}>
          {item.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {item.value}
        </Typography>
      </div>
    </div>
  ))
}

const renderTeams = (teams: Array<{ name: string; role: string }>) => {
  return teams.map((team, index) => (
    <Chip key={index} label={`${team.name} (${team.role})`} color='primary' variant='outlined' />
  ))
}

const AboutOverview = ({ data }: { data?: ProfileTabType }) => {
  // Contoh data dengan icon statis
  const aboutItems: ProfileItem[] = [
    {
      title: 'Full Name',
      value: data?.name || 'Not specified',
      icon: 'ri-user-line'
    },
    {
      title: 'Email',
      value: data?.email || 'Not specified',
      icon: 'ri-mail-line'
    },
    {
      title: 'Role',
      value: data?.role || 'Not specified',
      icon: 'ri-shield-user-line'
    }
  ]

  // const contactItems: ProfileItem[] = [
  //   {
  //     title: 'Email',
  //     value: data?.email || 'Not specified',
  //     icon: 'ri-mail-send-line'
  //   },
  //   {
  //     title: 'Phone',
  //     value: data?.phone || 'Not specified',
  //     icon: 'ri-phone-line'
  //   }
  // ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            {/* About Section */}
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                About
              </Typography>
              <div className='grid md:grid-cols-1 gap-4'>{renderList(aboutItems)}</div>
            </div>

            {/* Teams Section */}
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Teams
              </Typography>
              <div className='flex flex-wrap gap-2'>{data?.teams && renderTeams(data.teams)}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Overview Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Overview
              </Typography>
              {data?.overview && renderList(data.overview)}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
