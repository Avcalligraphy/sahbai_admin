'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'

import Swal from 'sweetalert2'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Types Imports
import type { UsersType } from '@/types/apps/userTypes'

import { useAppContext } from '@/contexts/AppContext'

type Props = {
  open: boolean
  handleClose: () => void
  initialData?: UsersType
}

type FormValidateType = {
  email: string
  password?: string
  username: string
  phone: string
  school: number
  roleUser: string
  blocked: boolean | '0' | '1'
  job: string
  reports: number[]
}

const AddUserDrawer = ({ open, handleClose, initialData }: Props) => {
  const { createUser, updateUser, usersLoading, usersError, schools, fetchSchools, reports, fetchReports } =
    useAppContext()

  // Fetch schools when component mounts
  useEffect(() => {
    fetchSchools()
    fetchReports()
  }, [])

  // Hooks
  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      email: '',
      password: '',
      username: '',
      phone: '',
      school: 0,
      roleUser: '',
      blocked: initialData ? (initialData.blocked ? '1' : '0') : '0',
      job: '',
      reports: initialData?.reports ? initialData.reports.map(report => report.id) : []
    }
  })

  const roleUser = watch('roleUser')

  // Effect untuk set initial data saat drawer dibuka
  useEffect(() => {
    if (initialData && open) {
      reset({
        email: initialData.email,
        username: initialData.username,
        phone: initialData.phone,
        roleUser: initialData.roleUser,
        school: initialData.school?.id || 0,
        job: initialData.job,
        reports: initialData?.reports ? initialData.reports.map(report => report.id) : []
      })
    } else if (!initialData && open) {
      // Reset form jika tidak ada initial data
      reset({
        email: '',
        password: '',
        username: '',
        phone: '',
        school: 0,
        roleUser: '',
        job: '',
        reports: []
      })
    }
  }, [initialData, open, reset])

  const onSubmit = async (data: FormValidateType) => {
    try {
      // Cek apakah ini update atau create

      const submitData = {
        ...data,
        blocked: data.blocked === '1' || data.blocked === true,
        reports: data.reports // Pastikan ini array number
      }

      if (initialData) {
        // Update
        await updateUser({
          id: initialData.id,
          ...submitData
        })

        Swal.fire({
          icon: 'success',
          title: 'User Updated Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        // Create
        await createUser({
          ...submitData,
          password: data.password || ''
        })

        Swal.fire({
          icon: 'success',
          title: 'User Created Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      }

      // Reset form dan tutup drawer
      reset()
      handleClose()
    } catch (error) {
      console.error('Failed to save user', error)

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: usersError || 'Something went wrong!'
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
        <Typography variant='h5'>{initialData ? 'Update User' : 'Add New User'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        {/* Error Handling */}
        {usersError && (
          <Typography color='error' variant='body2' className='mb-4'>
            {usersError}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {/* Username Field */}
          <Controller
            name='username'
            control={control}
            rules={{
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Username'
                placeholder='johndoe'
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Email is required',
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
                label='Email'
                placeholder='johndoe@gmail.com'
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Password Field (hanya untuk create) */}
          {!initialData && (
            <Controller
              name='password'
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
                  label='Password'
                  placeholder='********'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          )}

          {/* Phone Field */}
          <Controller
            name='phone'
            control={control}
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Invalid phone number'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='tel'
                label='Phone'
                placeholder='1234567890'
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />

          {/* Blocked User Dropdown */}
          <FormControl fullWidth error={!!errors.blocked}>
            <InputLabel id='status-select'>Select Status</InputLabel>
            <Controller
              name='blocked'
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label='Select Status'
                  labelId='status-select'
                  value={field.value === true || field.value === '1' ? '1' : '0'}
                  onChange={e => {
                    // Konversi ke boolean
                    field.onChange(e.target.value === '1')
                  }}
                >
                  <MenuItem value='0'>Active</MenuItem>
                  <MenuItem value='1'>Blocked</MenuItem>
                </Select>
              )}
            />
            {errors.blocked && <FormHelperText error>{errors.blocked.message}</FormHelperText>}
          </FormControl>

          {/* Role User Dropdown */}
          <FormControl fullWidth error={!!errors.roleUser}>
            <InputLabel id='role-user-select'>Select Role</InputLabel>
            <Controller
              name='roleUser'
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field }) => (
                <Select {...field} label='Select Role' labelId='role-user-select'>
                  <MenuItem value='user'>User</MenuItem>
                  <MenuItem value='teacher'>Teacher</MenuItem>
                </Select>
              )}
            />
            {errors.roleUser && <FormHelperText error>{errors.roleUser.message}</FormHelperText>}
          </FormControl>

          {/* School Dropdown */}
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
                  {schools.map(school => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.school && <FormHelperText error>{errors.school.message}</FormHelperText>}
          </FormControl>

          {roleUser === 'teacher' && (
            <>
              <Controller
                name='job'
                control={control}
                rules={{
                  required: roleUser === 'teacher' ? 'Job is required for teachers' : false
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Job/Position'
                    placeholder='e.g. Mathematics Teacher'
                    error={!!errors.job}
                    helperText={errors.job?.message}
                  />
                )}
              />

              <FormControl fullWidth>
                <InputLabel id='reports-select'>Select Reports</InputLabel>
                <Controller
                  name='reports'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      label='Select Reports'
                      labelId='reports-select'
                      renderValue={selected => (
                        <div>
                          {(selected as number[])
                            .map(reportId => {
                              const report = reports.find(r => r.id === reportId)

                              return report ? report.victimName : ''
                            })
                            .join(', ')}
                        </div>
                      )}
                    >
                      {reports.map(report => (
                        <MenuItem key={report.id} value={report.id}>
                          <Checkbox checked={field.value.includes(report.id)} />
                          {report.victimName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </>
          )}

          {/* Action Buttons */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={usersLoading}>
              {initialData ? 'Update User' : 'Create User'}
            </Button>
            <Button variant='outlined' color='error' onClick={handleReset} disabled={usersLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
