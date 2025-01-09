import { redirect } from 'next/navigation'

import dynamic from 'next/dynamic'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'

// Next Imports

// Type Imports
import type { ProfileHeaderType, ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import UserProfile from '@views/pages/user-profile'

const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'SUPERADMIN'
    case 'school':
      return 'SCHOOL ADMIN'
    case 'teacher':
      return 'TEACHER'
    default:
      return 'UNKNOWN ROLE'
  }
}

const ProfilePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Contoh transformasi data untuk ProfileHeaderType
  const headerData: ProfileHeaderType = {
    name: session?.user?.name ?? 'Unknown',
    email: session?.user?.email ?? 'Unknown',
    role: session.user.role,
    designation: session.user.role,
    location: 'Not specified', // Tambahkan logika sesuai kebutuhan
    joiningDate: new Date().toLocaleDateString() // Contoh
  }

  // Contoh transformasi data untuk ProfileTabType
  const profileData: ProfileTabType = {
    name: session.user.name ?? 'Unknown',
    email: session.user.email ?? 'Unknown',
    role: session.user.role,
    phone: session.user.phone ?? 'Not specified',
    about: [
      {
        title: 'Full Name',
        value: session.user.name ?? 'Not specified',
        icon: 'ri-user-line'
      },
      {
        title: 'Email',
        value: session.user.email ?? 'Not specified',
        icon: 'ri-mail-line'
      },
      {
        title: 'Role',
        value: session.user.role ?? 'Not specified',
        icon: 'ri-shield-user-line'
      }
    ],
    contacts: [
      {
        title: 'Email',
        value: session.user.email ?? 'Not specified',
        icon: 'ri-mail-send-line'
      },
      {
        title: 'Phone',
        value: session.user.phone ?? 'Not specified',
        icon: 'ri-phone-line'
      }
    ],
    teams: [
      {
        name: getRoleLabel(session.user.role ?? 'Unknown'),
        role: 'Member',
        icon: 'ri-code-line'
      }
    ],
    overview: [
      {
        title: 'Language',
        value: 'English',
        icon: 'ri-global-line'
      },
      {
        title: 'Country',
        value: 'Indonesia',
        icon: 'ri-map-pin-line'
      }
    ]
  }

  const tabContentList = {
    profile: <ProfileTab data={profileData} />
  }

  return <UserProfile data={headerData} tabContentList={tabContentList} />
}

export default ProfilePage
