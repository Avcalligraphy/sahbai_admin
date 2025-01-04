'use client'

// MUI Imports
import { useEffect, useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

import type { SessionsType } from '@/types/apps/aspirationsTypes'
import type { ReportsType } from '@/types/apps/reportsTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { useAppContext } from '@/contexts/AppContext'

const ReportsCard = ({ session }: { session: SessionsType }) => {
  const { reports, fetchReports } = useAppContext()
  const [filteredData, setFilteredData] = useState<ReportsType[]>([])

  // Fetch users saat komponen dimount
  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    // Pastikan orderData tersedia
    if (!reports) return

    // Filter berdasarkan role
    let result = reports

    // Jika bukan admin, filter berdasarkan sekolah user
    if (session?.user?.role === 'school') {
      result = result.filter(report => report.school.data?.attributes?.title === session?.user?.name)
    }

    if (session?.user?.role === 'teacher') {
      result = result.filter(report => report.user?.data?.attributes?.username === session?.user?.name)
    }

    setFilteredData(result)
  }, [reports, session])

  const reportStats = useMemo(() => {
    return {
      totalReports: filteredData.length,
      victimReports: filteredData.filter(report => report.victimName).length,
      perpetratorReports: filteredData.filter(report => report.perpetratorName).length
    }
  }, [filteredData])

  const cardData = [
    {
      title: 'Total Reports',
      stats: reportStats.totalReports,
      avatarIcon: 'ri-file-list-3-line', // Daftar laporan keseluruhan
      avatarColor: 'primary'
    },
    {
      title: 'Victim Report',
      stats: reportStats.victimReports,
      avatarIcon: 'ri-emotion-sad-line', // Ikon sedih/korban
      avatarColor: 'success'
    },
    {
      title: 'Perpetrator Report',
      stats: reportStats.perpetratorReports,
      avatarIcon: 'ri-error-warning-line', // Ikon peringatan/pelaku
      avatarColor: 'warning'
    }
  ]

  return (
    <Grid container spacing={6}>
      {cardData.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className='flex justify-between gap-1'>
              <div className='flex flex-col gap-1 flex-grow'>
                <Typography color='text.primary'>{card.title}</Typography>
                <div className='flex items-center gap-2 flex-wrap'>
                  <Typography variant='h4'>{card.stats}</Typography>
                </div>
              </div>
              <CustomAvatar color={card.avatarColor as any} skin='light' variant='rounded' size={42}>
                <i className={classnames(card.avatarIcon, 'text-[26px]')} />
              </CustomAvatar>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ReportsCard
