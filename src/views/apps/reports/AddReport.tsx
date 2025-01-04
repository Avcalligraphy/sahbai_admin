'use client'

import { useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import axios from 'axios'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Box } from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

import { useAppContext } from '@/contexts/AppContext'
import type { ReportsType } from '@/types/apps/reportsTypes'

// Types
type Props = {
  open: boolean
  handleClose: () => void
  initialData?: ReportsType
}

// Form Validation Type
type FormValidateType = {
  victimName: string
  victimClass: string
  victimGender: string
  perpetratorName: string
  perpetratorClass: string
  perpetratorGender: string
  dateIncident: string
  noteIncident: string
  timeIncident: string
  locationIncident: string
  status: string
  photoIncident?: File | null
  user: number
}

const AddReport = ({ open, handleClose, initialData }: Props) => {
  // Use App Context
  const {
    createReport,
    updateReport,
    reportsLoading,
    reportsError,
    users, // Pastikan users sudah di-fetch di context
    fetchUsers
  } = useAppContext()

  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const teachers = users.filter(user => user.roleUser === 'teacher')

  // Fetch teachers on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Effect untuk preview gambar
  useEffect(() => {
    if (selectedFile) {
      // Buat URL preview
      const reader = new FileReader()

      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }

      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview(null)
    }
  }, [selectedFile])

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      victimName: '',
      victimClass: '',
      victimGender: '',
      perpetratorName: '',
      perpetratorClass: '',
      perpetratorGender: '',
      dateIncident: '',
      noteIncident: '',
      timeIncident: '',
      locationIncident: '',
      status: '',
      user: 0
    }
  })

  // Effect untuk set initial data saat drawer dibuka
  useEffect(() => {
    if (initialData && open) {
      reset({
        victimName: initialData.victimName,
        victimClass: initialData.victimClass,
        victimGender: initialData.victimGender,
        perpetratorName: initialData.perpetratorName,
        perpetratorClass: initialData.perpetratorClass,
        perpetratorGender: initialData.perpetratorGender,
        dateIncident: initialData.dateIncident,
        noteIncident: initialData.noteIncident,
        timeIncident: initialData.timeIncident,
        locationIncident: initialData.locationIncident,
        status: initialData.status,
        user: initialData.user?.data?.id || 0
      })

      if (initialData.photoIncident?.data?.attributes?.url) {
        setFilePreview(`${process.env.NEXT_PUBLIC_STRAPI_URL}${initialData.photoIncident.data.attributes.url}`)
      }
    } else if (!initialData && open) {
      // Reset form jika tidak ada initial data
      reset({
        victimName: '',
        victimClass: '',
        victimGender: '',
        perpetratorName: '',
        perpetratorClass: '',
        perpetratorGender: '',
        dateIncident: '',
        noteIncident: '',
        timeIncident: '',
        locationIncident: '',
        status: '',
        user: 0
      })

      // Reset preview
      setFilePreview(null)
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

      // Log full response untuk debugging
      console.log('Upload Response:', uploadResponse.data)

      // Strapi biasanya mengembalikan array of uploaded files
      const uploadedFiles = uploadResponse.data

      // Kembalikan ID file pertama
      return uploadedFiles.length > 0 ? uploadedFiles[0].id : null
    } catch (error) {
      console.error('File upload failed', error)

      // Logging error detail
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data)
      }

      return null
    }
  }

  // Submit Handler

  const onSubmit = async (data: FormValidateType) => {
    try {
      // Upload file jika ada
      let photoIncidentId = null

      if (selectedFile) {
        // Jika ada file baru yang dipilih, upload
        photoIncidentId = await handleFileUpload(selectedFile)
      } else if (initialData && initialData.photoIncident?.data?.id) {
        // Jika tidak ada file baru, gunakan ID foto dari data awal
        photoIncidentId = initialData.photoIncident.data.id
      }

      // Cek apakah ini update atau create
      if (initialData) {
        // Update
        await updateReport({
          id: initialData.id,
          ...data,
          photoIncident: photoIncidentId
        })

        Swal.fire({
          icon: 'success',
          title: 'Report Updated Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        // Create
        await createReport({
          ...data,
          photoIncident: photoIncidentId
        })

        Swal.fire({
          icon: 'success',
          title: 'Report Created Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      }

      // Reset form dan tutup drawer
      reset()
      setSelectedFile(null)
      handleClose()
    } catch (error) {
      console.error('Failed to save report', error)

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: reportsError || 'Something went wrong!'
      })
    }
  }

  // Reset Handler
  const handleReset = () => {
    reset()
    setSelectedFile(null)
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{initialData ? 'Update Report' : 'Add New Report'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />

      <div className='p-5'>
        {/* Error Handling */}
        {reportsError && (
          <Typography color='error' variant='body2' className='mb-4'>
            {reportsError}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {/* Victim Name Field */}
          <Controller
            name='victimName'
            control={control}
            rules={{
              required: 'Victim Name is required',
              minLength: {
                value: 2,
                message: 'Victim Name must be at least 2 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Victim Name'
                placeholder='Enter victim name'
                error={!!errors.victimName}
                helperText={errors.victimName?.message}
              />
            )}
          />

          {/* Victim Class Field */}
          <Controller
            name='victimClass'
            control={control}
            rules={{ required: 'Victim Class is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Victim Class'
                placeholder='Enter victim class'
                error={!!errors.victimClass}
                helperText={errors.victimClass?.message}
              />
            )}
          />

          {/* Victim Gender Field */}
          <FormControl fullWidth error={!!errors.victimGender}>
            <InputLabel id='victim-gender-select'>Victim Gender</InputLabel>
            <Controller
              name='victimGender'
              control={control}
              rules={{ required: 'Victim Gender is required' }}
              render={({ field }) => (
                <Select {...field} label='Victim Gender' labelId='victim-gender-select'>
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                </Select>
              )}
            />
            {errors.victimGender && (
              <Typography color='error' variant='body2'>
                {errors.victimGender.message}
              </Typography>
            )}
          </FormControl>

          {/* Perpetrator Name Field */}
          <Controller
            name='perpetratorName'
            control={control}
            rules={{
              required: 'Perpetrator Name is required',
              minLength: {
                value: 2,
                message: 'Perpetrator Name must be at least 2 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Perpetrator Name'
                placeholder='Enter perpetrator name'
                error={!!errors.perpetratorName}
                helperText={errors.perpetratorName?.message}
              />
            )}
          />

          {/* Perpetrator Class Field */}
          <Controller
            name='perpetratorClass'
            control={control}
            rules={{ required: 'Perpetrator Class is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Perpetrator Class'
                placeholder='Enter perpetrator class'
                error={!!errors.perpetratorClass}
                helperText={errors.perpetratorClass?.message}
              />
            )}
          />

          {/* Perpetrator Gender Field */}
          <FormControl fullWidth error={!!errors.perpetratorGender}>
            <InputLabel id='perpetrator-gender-select'>Perpetrator Gender</InputLabel>
            <Controller
              name='perpetratorGender'
              control={control}
              rules={{ required: 'Perpetrator Gender is required' }}
              render={({ field }) => (
                <Select {...field} label='Perpetrator Gender' labelId='perpetrator-gender-select'>
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                </Select>
              )}
            />
            {errors.perpetratorGender && (
              <Typography color='error' variant='body2'>
                {errors.perpetratorGender.message}
              </Typography>
            )}
          </FormControl>

          {/* Date Incident Field */}
          <Controller
            name='dateIncident'
            control={control}
            rules={{ required: 'Date of Incident is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='date'
                label='Date of Incident'
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateIncident}
                helperText={errors.dateIncident?.message}
              />
            )}
          />
          {/* Time Incident Field */}
          <Controller
            name='timeIncident'
            control={control}
            rules={{ required: 'Time of Incident is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='time'
                label='Time of Incident'
                InputLabelProps={{ shrink: true }}
                error={!!errors.timeIncident}
                helperText={errors.timeIncident?.message}
              />
            )}
          />

          {/* Location Incident Field */}
          <Controller
            name='locationIncident'
            control={control}
            rules={{
              required: 'Location of Incident is required',
              minLength: {
                value: 3,
                message: 'Location must be at least 3 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Location of Incident'
                placeholder='Enter incident location'
                error={!!errors.locationIncident}
                helperText={errors.locationIncident?.message}
              />
            )}
          />

          {/* Note Incident Field */}
          <Controller
            name='noteIncident'
            control={control}
            rules={{
              required: 'Note is required',
              minLength: {
                value: 10,
                message: 'Note must be at least 10 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Incident Note'
                placeholder='Provide detailed description'
                multiline
                rows={4}
                error={!!errors.noteIncident}
                helperText={errors.noteIncident?.message}
              />
            )}
          />

          {/* Status Field */}
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel id='status-select'>Status</InputLabel>
            <Controller
              name='status'
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <Select {...field} label='Status' labelId='status-select'>
                  <MenuItem value=''>All Status</MenuItem>
                  <MenuItem value='Submitted'>Submitted</MenuItem>
                  <MenuItem value='Under Review'>Under Review</MenuItem>
                  <MenuItem value='In Progress'>In Progress</MenuItem>
                  <MenuItem value='Pending'>Pending</MenuItem>
                  <MenuItem value='Resolved'>Resolved</MenuItem>
                  <MenuItem value='Rejected'>Rejected</MenuItem>
                </Select>
              )}
            />
            {errors.status && (
              <Typography color='error' variant='body2'>
                {errors.status.message}
              </Typography>
            )}
          </FormControl>

          {/* Teacher Field */}
          <FormControl fullWidth error={!!errors.user}>
            <InputLabel id='teacher-select'>Select Teacher</InputLabel>
            <Controller
              name='user'
              control={control}
              rules={{
                required: 'Teacher is required',
                validate: value => value !== 0 || 'Please select a teacher'
              }}
              render={({ field }) => (
                <Select {...field} label='Select Teacher' labelId='teacher-select'>
                  {teachers.map(teacher => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.username} - {teacher.school?.title || 'No School'}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.user && (
              <Typography color='error' variant='body2'>
                {errors.user.message}
              </Typography>
            )}
          </FormControl>

          {/* Photo Incident Field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
            <input
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              id='photo-upload'
              onChange={e => {
                const file = e.target.files?.[0]

                if (file) {
                  setSelectedFile(file)
                }
              }}
            />
            <label htmlFor='photo-upload'>
              <Button variant='contained' component='span' startIcon={<i className='ri-upload-2-line' />}>
                Upload Incident Photo
              </Button>
            </label>

            {/* Image Preview */}
            {(filePreview || initialData?.photoIncident?.data?.attributes?.url) && (
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px dashed grey',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={
                    filePreview ||
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}${initialData?.photoIncident?.data?.attributes?.url}`
                  }
                  alt='Incident Preview'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}

            {/* File Name Display */}
            {selectedFile && (
              <Typography variant='body2' color='text.secondary'>
                Selected File: {selectedFile.name}
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    setSelectedFile(null)
                    setFilePreview(null)
                  }}
                >
                  <i className='ri-close-line' />
                </IconButton>
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={reportsLoading}>
              {reportsLoading
                ? initialData
                  ? 'Updating...'
                  : 'Creating...'
                : initialData
                  ? 'Update Report'
                  : 'Create Report'}
            </Button>
            <Button variant='outlined' color='error' onClick={handleReset} disabled={reportsLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddReport
