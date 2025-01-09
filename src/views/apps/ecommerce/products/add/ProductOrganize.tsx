'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

const ProductOrganize = () => {
  // States
  const [school, setSchool] = useState('')

  return (
    <Card>
      <CardHeader title='School And Writter Information' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-5'>
          <FormControl fullWidth>
            <InputLabel>Select School</InputLabel>
            <Select label='Select Vendor' value={school} onChange={e => setSchool(e.target.value)}>
              <MenuItem value={`Men's Clothing`}>Men&apos;s Clothing</MenuItem>
              <MenuItem value={`Women's Clothing`}>Women&apos;s Clothing</MenuItem>
              <MenuItem value={`Kid's Clothing`}>Kid&apos;s Clothing</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label='Writer' placeholder='Fashion, Trending, Summer' />
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
