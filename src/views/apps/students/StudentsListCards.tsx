'use client'
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

import type { SessionsType } from '@/types/apps/aspirationsTypes'
import type { UsersType } from '@/types/apps/userTypes'

import CustomAvatar from '@/@core/components/mui/Avatar'

// Component Imports
import { useAppContext } from '@/contexts/AppContext'

const StudentsListCards = ({ session }: { session: SessionsType }) => {
  const { users, fetchUsers } = useAppContext()
  const [filteredData, setFilteredData] = useState<UsersType[]>([])

  // Fetch users saat komponen dimount
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    // Pastikan orderData tersedia
    if (!users) return

    // Filter berdasarkan role
    let result = users

    // Jika bukan admin, filter berdasarkan sekolah user
    if (session?.user?.role === 'school') {
      result = result.filter(user => user.school?.title === session?.user?.name)
    }

    setFilteredData(result)
  }, [users, session])

  // Hitung statistik users
  const userStats = useMemo(() => {
    return {
      totalUsers: filteredData.length,
      activeUsers: filteredData.filter(user => !user.blocked).length,
      blockedUsers: filteredData.filter(user => user.blocked).length,
      students: filteredData.filter(user => user.roleUser === 'user').length,
      teachers: filteredData.filter(user => user.roleUser === 'teacher').length
    }
  }, [filteredData])

  // Card data
  const cardData = [
    {
      title: 'Total Users',
      stats: userStats.totalUsers,
      avatarIcon: 'ri-group-line',
      avatarColor: 'primary'
    },
    {
      title: 'Active Users',
      stats: userStats.activeUsers,
      avatarIcon: 'ri-user-follow-line',
      avatarColor: 'success'
    },
    {
      title: 'Blocked Users',
      stats: userStats.blockedUsers,
      avatarIcon: 'ri-user-unfollow-line',
      avatarColor: 'warning'
    },
    {
      title: 'Students',
      stats: userStats.students,
      avatarIcon: 'ri-graduation-cap-line',
      avatarColor: 'info'
    },
    {
      title: 'Teachers',
      stats: userStats.teachers,
      avatarIcon: 'ri-team-line',
      avatarColor: 'secondary'
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
                <Typography variant='body2'>{new Date().toLocaleDateString()}</Typography>
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

export default StudentsListCards
