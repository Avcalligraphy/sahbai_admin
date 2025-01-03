import ExcelJS from 'exceljs'

import type { SchoolsType } from '@/types/apps/schoolsTypes'
import type { AspirationsType } from '@/types/apps/aspirationsTypes'
import type { UsersType } from '@/types/apps/userTypes'
import type { ReportsType } from '@/types/apps/reportsTypes'

export const exportSchoolsToExcel = async (schools: SchoolsType[]) => {
  // Buat workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Schools')

  // Tambahkan header
  worksheet.columns = [
    { header: 'School ID', key: 'id', width: 10 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Address', key: 'address', width: 50 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Total Students', key: 'students', width: 15 },
    { header: 'Total Teachers', key: 'teachers', width: 15 }
  ]

  // Tambahkan data
  schools.forEach(school => {
    worksheet.addRow({
      id: school.id,
      title: school.title,
      address: school.address,
      status: school.schoolsStatus,
      students: school.users_permissions_users?.data?.length || 0,
      teachers: school.teachers?.data?.length || 0
    })
  })

  // Styling header
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F0F0F0' }
    }
  })

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const downloadExcel = (blob: Blob, filename: string) => {
    // Buat URL objek dari blob

    const url = window.URL.createObjectURL(blob)

    // Buat elemen anchor
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    // Tambahkan ke body (diperlukan untuk beberapa browser)
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Bersihkan
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  downloadExcel(blob, `schools_export_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportAspirationsToExcel = async (aspirations: AspirationsType[]) => {
  // Buat workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Aspirations')

  // Tambahkan header
  worksheet.columns = [
    { header: 'Aspirations ID', key: 'id', width: 30 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'User', key: 'user', width: 15 },
    { header: 'School', key: 'school', width: 15 }
  ]

  // Tambahkan data
  aspirations.forEach(aspiration => {
    worksheet.addRow({
      id: aspiration.id,
      title: aspiration.title,
      description: aspiration.description,
      status: aspiration.aspirationsStatus,
      user: aspiration.users_permissions_user?.data?.attributes?.username || 'Unknown',
      school: aspiration.school.data?.attributes?.title || 'Unknown'
    })
  })

  // Styling header
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F0F0F0' }
    }
  })

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const downloadExcel = (blob: Blob, filename: string) => {
    // Buat URL objek dari blob

    const url = window.URL.createObjectURL(blob)

    // Buat elemen anchor
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    // Tambahkan ke body (diperlukan untuk beberapa browser)
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Bersihkan
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  downloadExcel(blob, `aspirations_export_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportUsersToExcel = async (users: UsersType[]) => {
  // Buat workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Users')

  // Tambahkan header
  worksheet.columns = [
    { header: 'User ID', key: 'id', width: 20 },
    { header: 'Username', key: 'username', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 30 },
    { header: 'Role User', key: 'roleUser', width: 15 }
  ]

  // Tambahkan data
  users.forEach(user => {
    worksheet.addRow({
      id: user.id,
      username: user.username,
      email: user.email,
      roleUser: user.roleUser,
      phone: user.phone
    })
  })

  // Styling header
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F0F0F0' }
    }
  })

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const downloadExcel = (blob: Blob, filename: string) => {
    // Buat URL objek dari blob

    const url = window.URL.createObjectURL(blob)

    // Buat elemen anchor
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    // Tambahkan ke body (diperlukan untuk beberapa browser)
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Bersihkan
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  downloadExcel(blob, `users_export_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportReportsToExcel = async (reports: ReportsType[]) => {
  // Buat workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Reports')

  // Tambahkan header
  worksheet.columns = [
    { header: 'Report ID', key: 'id', width: 15 },
    { header: 'Victim Name', key: 'victimName', width: 30 },
    { header: 'Victim Class', key: 'victimClass', width: 15 },
    { header: 'Victim Gender', key: 'victimGender', width: 20 },
    { header: 'Perpetrator Name', key: 'perpetratorName', width: 30 },
    { header: 'Perpetrator Class', key: 'perpetratorClass', width: 15 },
    { header: 'Perpetrator Gender', key: 'perpetratorGender', width: 20 },
    { header: 'Date Incident', key: 'dateIncident', width: 20 },
    { header: 'Time Incident', key: 'timeIncident', width: 15 },
    { header: 'Location Incident', key: 'locationIncident', width: 30 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 25 }
  ]

  // Tambahkan data
  reports.forEach(report => {
    worksheet.addRow({
      id: report.id,
      victimName: report.victimName,
      victimClass: report.victimClass,
      victimGender: report.victimGender,
      perpetratorName: report.perpetratorName,
      perpetratorClass: report.perpetratorClass,
      perpetratorGender: report.perpetratorGender,
      dateIncident: report.dateIncident,
      timeIncident: report.timeIncident,
      locationIncident: report.locationIncident,
      status: report.status,
      createdAt: new Date(report.createdAt).toLocaleString() // Format tanggal sesuai kebutuhan
    })
  })

  // Styling header
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F0F0F0' }
    }
  })

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const downloadExcel = (blob: Blob, filename: string) => {
    // Buat URL objek dari blob

    const url = window.URL.createObjectURL(blob)

    // Buat elemen anchor
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    // Tambahkan ke body (diperlukan untuk beberapa browser)
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Bersihkan
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  downloadExcel(blob, `reports_export_${new Date().toISOString().split('T')[0]}.xlsx`)
}
