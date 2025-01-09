'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

import axios from 'axios'

import { Dialog, DialogContent } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { useForm, Controller } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'

// Component Imports
import ProductAddHeader from '@views/apps/ecommerce/products/add/ProductAddHeader'
import ProductInformation from '@views/apps/ecommerce/products/add/ProductInformation'
import ProductImage from '@views/apps/ecommerce/products/add/ProductImage'

import { useAppContext } from '@/contexts/AppContext'
import type { ReadingType, RichTextContent } from '@/types/apps/readingTypes'
import type { SchoolsType } from '@/types/apps/schoolsTypes'

type ReadingFormType = {
  title: string
  content: RichTextContent[]
  school: number
  writter: string
  image?: File | null
}

// Types
type Props = {
  open: boolean
  handleClose: () => void
  initialData?: ReadingType
  role?: string
  schoolName?: string
}

const AddReading = ({ open, handleClose, initialData, role, schoolName }: Props) => {
  const { createReadings, schools, fetchSchools, updateReadings } = useAppContext()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredData, setFilteredData] = useState<SchoolsType[]>([])

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    // Pastikan orderData tersedia
    if (!schools) return

    // Filter berdasarkan role
    let result = schools

    // Jika bukan admin, filter berdasarkan sekolah user
    if (role === 'school') {
      result = result.filter(school => school.title === schoolName)
    }

    setFilteredData(result)
  }, [schools, role, schoolName])

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ReadingFormType>({
    defaultValues: {
      title: '',
      content: [],
      school: 0,
      writter: ''
    }
  })

  // Effect untuk set initial data saat drawer dibuka
  useEffect(() => {
    if (initialData && open) {
      reset({
        title: initialData?.title,
        content: initialData?.content,
        school: initialData?.school?.data?.id,
        writter: initialData?.writter
      })
    } else if (!initialData && open) {
      // Reset form jika tidak ada initial data
      reset({
        title: '',
        content: [],
        school: 0,
        writter: ''
      })
      setSelectedFile(null)
    }
  }, [initialData, open, reset])

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    const token = process.env.NEXT_PUBLIC_DEFAULT_TOKEN

    formData.append('files', file)

    try {
      const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      const uploadedFiles = uploadResponse.data

      return uploadedFiles.length > 0 ? uploadedFiles[0].id : null
    } catch (error) {
      console.error('File upload failed', error)

      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data)
      }

      return null
    }
  }

  const onSubmit = async (data: ReadingFormType) => {
    try {
      setIsLoading(true)
      setError(null)

      let imageId = null

      if (selectedFile) {
        // Jika ada file baru yang dipilih, upload
        imageId = await handleFileUpload(selectedFile)
      } else if (initialData && initialData.image?.data?.id) {
        // Jika tidak ada file baru, gunakan ID foto dari data awal
        imageId = initialData.image.data?.id
      }

      if (initialData) {
        await updateReadings({
          id: initialData.id ?? 0,
          ...data,
          image: imageId
        })
      } else {
        await createReadings({
          title: data.title,
          content: data.content,
          writter: data.writter,
          school: data.school,
          image: imageId
        })
      }

      setSelectedFile(null)
      reset()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xl'>
      <div className='flex items-center justify-end pli-5 plb-4'>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ProductAddHeader onPublish={handleSubmit(onSubmit)} isLoading={isLoading} error={error} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <ProductInformation control={control} errors={errors} setValue={setValue} initialData={initialData} />
                </Grid>
                <Grid item xs={12}>
                  <ProductImage onFileSelect={setSelectedFile} initialData={initialData} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title='School And Writter Information' />
                    <CardContent>
                      <div className='flex flex-col gap-5'>
                        <FormControl fullWidth error={!!errors.school}>
                          <InputLabel id='school-select'>Select School</InputLabel>
                          <Controller
                            name='school'
                            control={control}
                            rules={{
                              required: 'School is required',
                              validate: value => value !== 0 || 'Please select a school'
                            }}
                            render={({ field }) => (
                              <Select {...field} label='Select School' labelId='school-select'>
                                {filteredData.map(school => (
                                  <MenuItem key={school.id} value={school.id}>
                                    {school.title}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.school && <FormHelperText error>{errors.school.message}</FormHelperText>}
                        </FormControl>
                        <Controller
                          name='writter'
                          control={control}
                          rules={{ required: 'Writer is required' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Writer'
                              error={!!errors.writter}
                              helperText={errors.writter?.message}
                            />
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddReading
