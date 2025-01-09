'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

import { useDropzone } from 'react-dropzone'

import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import type { ReadingType } from '@/types/apps/readingTypes'

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url

  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`
}

type FileProp = File & {
  preview?: string
}

interface ProductImageProps {
  onFileSelect: (file: File | null) => void
  initialData?: ReadingType
}

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const ProductImage = ({ onFileSelect, initialData }: ProductImageProps) => {
  const [selectedFile, setSelectedFile] = useState<FileProp | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (initialData?.image?.data?.attributes?.url) {
      const imageUrl = getImageUrl(initialData.image.data.attributes.url)

      setPreview(imageUrl)
    }
  }, [initialData])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]

      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      onFileSelect(file)
    },
    maxFiles: 1
  })

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview)
    setSelectedFile(null)
    setPreview('')
    onFileSelect(null)
  }

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title='Content Image'
          action={
            <Typography
              component={Link}
              href='/'
              onClick={e => e.preventDefault()}
              color='primary'
              className='font-medium'
            >
              Add media from URL
            </Typography>
          }
          sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
        />
        <CardContent>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='ri-upload-2-line' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your Image Here.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='outlined' size='small'>
                Browse Image
              </Button>
            </div>
          </div>
          {(selectedFile || preview) && (
            <List>
              <ListItem className='pis-4 plb-3'>
                <div className='file-details flex items-center gap-4'>
                  <img src={preview} alt='Preview' className='w-10 h-10 object-cover rounded' />
                  <div>
                    <Typography className='font-medium'>
                      {selectedFile?.name || initialData?.image?.data?.attributes?.name}
                    </Typography>
                    {selectedFile && (
                      <Typography variant='body2'>{Math.round(selectedFile.size / 1024).toFixed(1)} kb</Typography>
                    )}
                  </div>
                </div>
                <IconButton onClick={handleRemoveFile}>
                  <i className='ri-close-line text-xl' />
                </IconButton>
              </ListItem>
            </List>
          )}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ProductImage
