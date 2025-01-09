'use client'

// React Imports
import { useEffect, useState } from 'react'

import axios from 'axios'

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
import { Box } from '@mui/material'

import Swal from 'sweetalert2'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Types Imports
import type { UsersType } from '@/types/apps/userTypes'
import type { SchoolsType } from '@/types/apps/schoolsTypes'

import { useAppContext } from '@/contexts/AppContext'

type Props = {
  open: boolean
  handleClose: () => void
  initialData?: UsersType
  role?: string
  schoolName?: string
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
  photo?: File | null
}

const AddUserDrawer = ({ open, handleClose, initialData, role, schoolName }: Props) => {
  const { createUser, updateUser, usersLoading, usersError, schools, fetchSchools, reports, fetchReports } =
    useAppContext()

  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [filteredData, setFilteredData] = useState<SchoolsType[]>([])

  // Fetch schools when component mounts
  useEffect(() => {
    fetchSchools()
    fetchReports()
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

      if (initialData.photo?.url) {
        setFilePreview(`${process.env.NEXT_PUBLIC_STRAPI_URL}${initialData.photo.url}`)
      }
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

  const onSubmit = async (data: FormValidateType) => {
    try {
      let photoId = null

      if (selectedFile) {
        // Jika ada file baru yang dipilih, upload
        photoId = await handleFileUpload(selectedFile)
      } else if (initialData && initialData.photo?.id) {
        // Jika tidak ada file baru, gunakan ID foto dari data awal
        photoId = initialData.photo.id
      }

      const submitData = {
        ...data,
        blocked: data.blocked === '1' || data.blocked === true,
        reports: data.reports // Pastikan ini array number
      }

      if (initialData) {
        // Update
        await updateUser({
          id: initialData.id,
          photo: photoId,
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
          photo: photoId,
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
      setSelectedFile(null)
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
              required: 'Nomor telepon wajib diisi',
              pattern: {
                value: /^(^\+62\s?|^0)(\d{9,12})$/,
                message: 'Nomor telepon tidak valid'
              },
              validate: value => {
                // Validasi panjang nomor HP Indonesia
                const cleanedNumber = value.replace(/\D/g, '')

                return (
                  (cleanedNumber.length >= 10 && cleanedNumber.length <= 13) || 'Nomor telepon harus antara 10-13 digit'
                )
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='tel'
                label='Nomor Telepon'
                placeholder='08xx-xxxx-xxxx'
                error={!!errors.phone}
                helperText={errors.phone?.message}
                inputProps={{
                  maxLength: 15 // Membatasi input maksimal
                }}
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
                    Upload User Photo
                  </Button>
                </label>

                {/* Image Preview */}
                {(filePreview || initialData?.photo?.url) && (
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
                      src={filePreview || `${process.env.NEXT_PUBLIC_STRAPI_URL}${initialData?.photo?.url}`}
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
