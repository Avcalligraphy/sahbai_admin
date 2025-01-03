// MUI Imports
import Grid from '@mui/material/Grid'
import { Tooltip } from '@mui/material'

import { formatDistance } from 'date-fns'

// Components Imports
import Sales from '@views/dashboards/ecommerce/Sales'
import LogisticsStatisticsCard from '@views/apps/logistics/dashboard/LogisticsStatisticsCard'
import CardStatVertical from '@components/card-statistics/Vertical'
import DonutChart from '@views/dashboards/crm/DonutChart'
import TotalTransactions from '@views/dashboards/analytics/TotalTransactions'
import Performance from '@views/dashboards/analytics/Performance'

// import OrganicSessions from '@views/dashboards/crm/OrganicSessions'
// import ProjectTimeline from '@views/dashboards/crm/ProjectTimeline'
// import WeeklyOverview from '@views/dashboards/crm/WeeklyOverview'
// import SocialNetworkVisits from '@views/dashboards/crm/SocialNetworkVisits'
// import MonthlyBudget from '@views/dashboards/crm/MonthlyBudget'
// import MeetingSchedule from '@views/dashboards/crm/MeetingSchedule'
// import ExternalLinks from '@views/dashboards/crm/ExternalLinks'
// import PaymentHistory from '@views/dashboards/crm/PaymentHistory'
// import SalesInCountries from '@views/dashboards/crm/SalesInCountries'
// import UserTable from '@views/dashboards/crm/UserTable'

// Server Action Imports
// import { getServerMode } from '@core/utils/serverHelpers'

// Data Imports
// import { getUserData } from '@/app/server/actions'
import { getAspirations } from '@/app/api/apps/aspirations/aspirations'
import { getReadingCorners } from '@/app/api/apps/reading-corners/readingCorners'
import { getReports } from '@/app/api/apps/reports/reports'
import { getSchools } from '@/app/api/apps/schools/schools'
import { getStudents } from '@/app/api/apps/students/students'
import type { ThemeColor } from '@/@core/types'

import type { ReadingType } from '@/types/apps/readingTypes'

const calculateWriterStats = (data: ReadingType[]) => {
  // Tipe untuk akumulasi penulis
  type WriterAccumulator = Record<
    string,
    {
      count: number
      latestArticle: {
        title: string
        date: string
      } | null
    }
  >

  // Hitung jumlah tulisan setiap penulis
  const writerCounts = data.reduce<WriterAccumulator>((acc, item) => {
    const writer = item.writter || 'Unknown'

    if (!acc[writer]) {
      acc[writer] = {
        count: 0,
        latestArticle: null
      }
    }

    acc[writer].count++

    // Simpan artikel terbaru
    const currentDate = new Date(item.createdAt)

    if (!acc[writer].latestArticle || new Date(acc[writer].latestArticle.date) < currentDate) {
      acc[writer].latestArticle = {
        title: item.title,
        date: item.createdAt
      }
    }

    return acc
  }, {})

  // Tipe untuk top writer
  type TopWriterType = {
    writer: string
    count: number
    latestArticle: { title: string; date: string } | null
  }

  // Temukan penulis dengan tulisan terbanyak
  const topWriter = Object.entries(writerCounts).reduce<TopWriterType>(
    (max, [writer, data]) =>
      data.count > max.count
        ? {
            writer,
            count: data.count,
            latestArticle: data.latestArticle
          }
        : max,
    {
      writer: 'Unknown',
      count: 0,
      latestArticle: null
    }
  )

  // Hitung trend (persentase dari total)
  const totalWriters = data.length
  const trendPercentage = Math.round((topWriter.count / totalWriters) * 100)

  return {
    topWriter: topWriter.writer,
    writerCount: topWriter.count,
    trendPercentage,
    latestArticle: topWriter.latestArticle
  }
}

const DashboardCRM = async () => {
  // Vars
  const { data: aspirations } = await getAspirations()
  const { data: readingCorners } = await getReadingCorners()
  const { data: reports } = await getReports()
  const { data: schools } = await getSchools()
  const { data: students } = await getStudents()

  // const serverMode = getServerMode()
  // const data = await getUserData()

  const writerStats = calculateWriterStats(readingCorners)

  const colorMapping: Record<string, ThemeColor> = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    info: 'info',
    error: 'error'
  }

  const dataStaticCard = [
    {
      title: 'Aspirations',
      stats: aspirations.length,
      trendNumber: 0,
      avatarIcon: 'ri-lightbulb-line', // Ikon ide/aspirasi
      color: colorMapping['primary']
    },
    {
      title: 'Reading Corners',
      stats: readingCorners.length,
      trendNumber: 0,
      avatarIcon: 'ri-book-open-line', // Ikon buku
      color: colorMapping['success']
    },
    {
      title: 'Reports',
      stats: reports.length,
      trendNumber: 0,
      avatarIcon: 'ri-file-list-3-line', // Ikon daftar laporan
      color: colorMapping['warning']
    },
    {
      title: 'Schools',
      stats: schools.length,
      trendNumber: 0,
      avatarIcon: 'ri-building-line', // Ikon gedung sekolah
      color: colorMapping['info']
    },
    {
      title: 'Users',
      stats: students.length,
      trendNumber: 0,
      avatarIcon: 'ri-group-line', // Ikon kelompok
      color: colorMapping['error']
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LogisticsStatisticsCard data={dataStaticCard} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Sales data={reports} />
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <CardStatVertical
          stats='4'
          title='Writter'
          trendNumber='38%'
          chipText='Most'
          avatarColor='success'
          avatarIcon='ri-handbag-line'
          avatarIconSize={24}
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <Tooltip
          title={
            writerStats.latestArticle
              ? `Latest Article: ${writerStats.latestArticle.title}\n` +
                `Published: ${formatDistance(new Date(writerStats.latestArticle.date), new Date(), {
                  addSuffix: true
                })}`
              : 'No recent articles'
          }
        >
          <div>
            <CardStatVertical
              stats={writerStats.writerCount.toString()}
              title='Top Writer'
              trendNumber={`${writerStats.trendPercentage}%`}
              chipText={writerStats.topWriter}
              avatarColor='success'
              avatarIcon='ri-pen-nib-line'
              avatarIconSize={24}
              avatarSkin='light'
              chipColor='secondary'
            />
          </div>
        </Tooltip>
      </Grid>
      <Grid item xs={12} sm={3} md={2}>
        <DonutChart />
      </Grid>
      <Grid item xs={12} md={8}>
        <TotalTransactions />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Performance />
      </Grid>
      {/* <Grid item xs={12} md={4}>
        <OrganicSessions />
      </Grid>
      <Grid item xs={12} md={8}>
        <ProjectTimeline />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <WeeklyOverview />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <SocialNetworkVisits />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MonthlyBudget />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MeetingSchedule />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ExternalLinks />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <PaymentHistory serverMode={serverMode} />
      </Grid>
      <Grid item xs={12} md={4}>
        <SalesInCountries />
      </Grid>
      <Grid item xs={12} md={8}>
        <UserTable tableData={data} />
      </Grid> */}
    </Grid>
  )
}

export default DashboardCRM
