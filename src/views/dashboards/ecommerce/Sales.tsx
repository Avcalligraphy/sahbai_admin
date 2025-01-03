import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import type { ReportsType } from '@/types/apps/reportsTypes'

// Mapping status ke icon dan warna
const STATUS_CONFIG: Record<string, { icon: string; color: ThemeColor }> = {
  Submitted: {
    icon: 'ri-file-text-line',
    color: 'primary'
  },
  'Under Review': {
    icon: 'ri-search-line',
    color: 'info'
  },
  'In Progress': {
    icon: 'ri-loader-2-line',
    color: 'warning'
  },
  Pending: {
    icon: 'ri-pause-line',
    color: 'secondary'
  },
  Resolved: {
    icon: 'ri-check-line',
    color: 'success'
  },
  Rejected: {
    icon: 'ri-close-line',
    color: 'error'
  }
}

const Sales = ({ data }: { data: ReportsType[] }) => {
  // Hitung statistik berdasarkan status
  const statusStats = data.reduce(
    (acc, report) => {
      const status = report.status || 'Unknown'

      // Inisialisasi jika belum ada
      if (!acc[status]) {
        acc[status] = {
          count: 0,
          icon: STATUS_CONFIG[status]?.icon || 'ri-file-line',
          color: STATUS_CONFIG[status]?.color || 'primary'
        }
      }

      // Tambahkan count
      acc[status].count++

      return acc
    },
    {} as Record<string, { count: number; icon: string; color: ThemeColor }>
  )

  // Konversi ke array untuk rendering
  const statsArray = Object.entries(statusStats).map(([status, stat]) => ({
    title: status,
    stats: stat.count.toString(),
    icon: stat.icon,
    color: stat.color
  }))

  // Hitung total laporan
  const totalReports = data.length

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Reports Overview'
        subheader={
          <div className='flex items-center gap-2'>
            <span>Total {totalReports} Reports</span>
            <span className='flex items-center text-success font-medium'>
              +{Math.round((statsArray.reduce((sum, item) => sum + parseInt(item.stats), 0) / totalReports) * 100)}%
              <i className='ri-arrow-up-s-line text-xl' />
            </span>
          </div>
        }
      />
      <CardContent>
        <div className='flex flex-wrap justify-between gap-4'>
          {statsArray.map((item, index) => (
            <div key={index} className='flex items-center gap-3'>
              <CustomAvatar variant='rounded' skin='light' color={item.color}>
                <i className={item.icon}></i>
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{item.stats}</Typography>
                <Typography>{item.title}</Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Sales
