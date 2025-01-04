import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'

// Data Imports
import { getReports } from '@/app/api/apps/reports/reports'
import ReportsList from '@/views/apps/reports'

import type { User } from '@/types/apps/aspirationsTypes'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/invoice` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getInvoiceData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/invoice`)

  if (!res.ok) {
    throw new Error('Failed to fetch invoice data')
  }

  return res.json()
} */

const ReportsApp = async () => {
  // Vars
  const { data } = await getReports()

  const session = await getServerSession(authOptions)

  return (
    <ReportsList
      invoiceData={data}
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

export default ReportsApp
