'use client'

import { useEffect } from 'react'

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
  initialData?: SchoolsType // Tambahkan untuk edit
}

// Form Validation Type
type FormValidateType = {
  title: string
  address: string
}

const AddSchool = ({ open, handleClose, initialData }: Props) => {
  // Use App Context
  const { createSchool, updateSchool, schoolsLoading, schoolsError } = useAppContext()

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      title: '',
      address: ''
    }
  })

  // Effect untuk set initial data saat drawer dibuka
  useEffect(() => {
    if (initialData && open) {
      reset({
        title: initialData.title,
        address: initialData.address
      })
    } else if (!initialData && open) {
      // Reset form jika tidak ada initial data
      reset({
        title: '',
        address: ''
      })
    }
  }, [initialData, open, reset])

  // Submit Handler
  const onSubmit = async (data: FormValidateType) => {
    try {
      // Cek apakah ini update atau create
      if (initialData) {
        // Update
        await updateSchool({
          id: initialData.id,
          title: data.title,
          address: data.address
        })

        Swal.fire({
          icon: 'success',
          title: 'School Updated Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        // Create
        await createSchool({
          title: data.title,
          address: data.address
        })

        Swal.fire({
          icon: 'success',
          title: 'School Created Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      }

      // Reset form dan tutup drawer
      reset()
      handleClose()
    } catch (error) {
      // Error handling sudah di-handle di context
      console.error('Failed to save school', error)

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      })
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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
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
          {/* Title Field */}
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

          {/* Address Field */}
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

          {/* Action Buttons */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={schoolsLoading}>
              {schoolsLoading
                ? initialData
                  ? 'Updating...'
                  : 'Creating...'
                : initialData
                  ? 'Update School'
                  : 'Create School'}
            </Button>
            <Button variant='outlined' color='error' onClick={handleReset} disabled={schoolsLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddSchool
