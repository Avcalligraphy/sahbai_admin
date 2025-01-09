// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

type ProductAddHeaderProps = {
  onPublish: () => void
  isLoading: boolean
  error: string | null
}

const ProductAddHeader = ({ onPublish, isLoading, error }: ProductAddHeaderProps) => {
  return (
    <div className='flex flex-wrap items-center justify-between gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          Add a new content
        </Typography>
        <Typography>content placed across your web</Typography>
      </div>
      <div className='flex flex-wrap gap-4'>
        <Button variant='contained' onClick={onPublish} disabled={isLoading}>
          {isLoading ? 'Publishing...' : 'Publish Content'}
        </Button>
      </div>
      {error && (
        <Alert severity='error' className='mb-4'>
          {error}
        </Alert>
      )}
    </div>
  )
}

export default ProductAddHeader
