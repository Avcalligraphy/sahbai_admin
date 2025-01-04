import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'

// Component Imports
import StudentsList from '@/views/apps/students'

// Data Imports
import { getStudents } from '@/app/api/apps/students/students'

import type { User } from '@/types/apps/aspirationsTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import themeConfig from '@/configs/themeConfig'

const StudentsListApp = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Cek role user
  if (session.user.role === 'teacher') {
    // Redirect ke homepage jika user adalah school
    const homePage = getLocalizedUrl(themeConfig.homePageUrl, 'en')

    redirect(homePage)
  }

  // Vars
  const { data } = await getStudents()

  return (
    <StudentsList
      userData={data}
      session={
        session
          ? {
              user: session.user as User,
              jwt: session.jwt
            }
          : { user: undefined, jwt: undefined }
      }
    />
  )
}

export default StudentsListApp
