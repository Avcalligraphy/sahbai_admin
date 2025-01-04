// Data Imports
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { getSchools } from '@/app/api/apps/schools/schools'

import SchoolsList from '@/views/apps/Schools'

import { authOptions } from '@/libs/auth'

import { getLocalizedUrl } from '@/utils/i18n'
import themeConfig from '@/configs/themeConfig'

const SchoolsApp = async () => {
  // Ambil session dari server
  const session = await getServerSession(authOptions)

  // Cek jika tidak ada session
  if (!session) {
    redirect('/login')
  }

  // Cek role user
  if (session.user.role === 'school' || session.user.role === 'teacher') {
    // Redirect ke homepage jika user adalah school
    const homePage = getLocalizedUrl(themeConfig.homePageUrl, 'en')

    redirect(homePage)
  }

  // Ambil data schools
  const { data } = await getSchools()

  return <SchoolsList invoiceData={data} />
}

export default SchoolsApp
