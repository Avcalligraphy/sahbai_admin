'use client'

import { useEffect, useState } from 'react'

import Swal from 'sweetalert2'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

import { useAppContext } from '@/contexts/AppContext'

import type { SchoolsType } from '@/types/apps/schoolsTypes'

// Types
type Props = {
  open: boolean
  handleClose: () => void
  initialData?: SchoolsType
}

// Form Validation Type
type FormValidateType = {
  title: string
  address: string
  adminName?: string
  adminEmail?: string
  adminPassword?: string
  adminPhone?: string
  user_school?: number
}

const AddSchool = ({ open, handleClose, initialData }: Props) => {
  // Use App Context
  const { createSchool, schoolsLoading, schoolsError, updateSchool } = useAppContext()

  // State untuk mengontrol loading
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      title: '',
      address: '',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      user_school: 0
    }
  })

  // Effect untuk set initial data saat drawer dibuka
  useEffect(() => {
    if (initialData && open) {
      reset({
        title: initialData.title,
        address: initialData.address,
        adminName: initialData.user_school?.data?.attributes?.username,
        adminEmail: initialData.user_school?.data?.attributes?.email,
        adminPhone: initialData.user_school?.data?.attributes?.phone,
        user_school: initialData.user_school?.data?.id || 0
      })
    } else if (!initialData && open) {
      // Reset form jika tidak ada initial data
      reset({
        title: '',
        address: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        adminPhone: ''
      })
    }
  }, [initialData, open, reset])

  // Submit Handler
  const onSubmit = async (data: FormValidateType) => {
    setIsLoading(true)

    try {
      // Cek apakah ini update atau create
      if (initialData) {
        // Update School
        await updateSchool({
          id: initialData.id,
          title: data.title,
          address: data.address,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          adminPhone: data.adminPhone,
          user_school: initialData.user_school?.data?.id || 0
        })

        Swal.fire({
          icon: 'success',
          title: 'School Updated Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        // Create School dengan admin
        await createSchool({
          title: data.title,
          address: data.address,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          adminPassword: data.adminPassword,
          adminPhone: data.adminPhone
        })

        Swal.fire({
          icon: 'success',
          title: 'School and Admin Created Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      }

      // Reset form dan tutup drawer
      reset()
      handleClose()
    } catch (error) {
      console.error('Failed to save school', error)

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error instanceof Error ? error.message : 'Something went wrong!'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset Handler
  const handleReset = () => {
    reset()
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{initialData ? 'Update School' : 'Add New School'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />

      <div className='p-5'>
        {/* Error Handling */}
        {schoolsError && (
          <Typography color='error' variant='body2' className='mb-4'>
            {schoolsError}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {/* School Details */}
          <Controller
            name='title'
            control={control}
            rules={{
              required: 'School title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='School Title'
                placeholder='Enter school name'
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name='address'
            control={control}
            rules={{
              required: 'School address is required',
              minLength: {
                value: 5,
                message: 'Address must be at least 5 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='School Address'
                placeholder='Enter school address'
                multiline
                rows={3}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />

          {/* Hanya tampilkan field admin jika bukan update */}
          <>
            <Typography variant='h6' className='mt-4'>
              School Admin Details
            </Typography>

            <Controller
              name='adminName'
              control={control}
              rules={{
                required: 'Admin name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Admin Name'
                  placeholder='Enter admin name'
                  error={!!errors.adminName}
                  helperText={errors.adminName?.message}
                />
              )}
            />

            <Controller
              name='adminEmail'
              control={control}
              rules={{
                required: 'Admin email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type='email'
                  label='Admin Email'
                  placeholder='Enter admin email'
                  error={!!errors.adminEmail}
                  helperText={errors.adminEmail?.message}
                />
              )}
            />

            {!initialData && (
              <Controller
                name='adminPassword'
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='password'
                    label='Admin Password'
                    placeholder='Enter admin password'
                    error={!!errors.adminPassword}
                    helperText={errors.adminPassword?.message}
                  />
                )}
              />
            )}

            <Controller
              name='adminPhone'
              control={control}
              rules={{
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10,12}$/,
                  message: 'Invalid phone number'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type='tel'
                  label='Admin Phone'
                  placeholder='Enter admin phone number'
                  error={!!errors.adminPhone}
                  helperText={errors.adminPhone?.message}
                />
              )}
            />
          </>

          {/* Action Buttons */}
          <div className='flex items-center gap-4 mt-4'>
            <Button variant='contained' type='submit' disabled={isLoading || schoolsLoading}>
              {isLoading
                ? initialData
                  ? 'Updating...'
                  : 'Creating...'
                : initialData
                  ? 'Update School'
                  : 'Create School'}
            </Button>
            <Button variant='outlined' color='error' onClick={handleReset} disabled={isLoading || schoolsLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddSchool
