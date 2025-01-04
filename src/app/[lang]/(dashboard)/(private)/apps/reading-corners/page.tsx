// Data Imports
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'

// Component Imports
import ReadingList from '@/views/apps/reading-corners'

// Data Imports

import { getReadingCorners } from '@/app/api/apps/reading-corners/readingCorners'
import type { User } from '@/types/apps/aspirationsTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import themeConfig from '@/configs/themeConfig'

const ReadingListPage = async () => {
  const session = await getServerSession(authOptions)

  // Cek jika tidak ada session

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
  const { data } = await getReadingCorners()

  return (
    <ReadingList
      orderData={data}
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

export default ReadingListPage
