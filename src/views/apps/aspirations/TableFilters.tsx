/* eslint-disable lines-around-comment */
// MUI Imports
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const TableFilters = () => {
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Status'
              value={status}
              // onChange={e => setStatus(e.target.value)}
              labelId='status-select'
            >
              <MenuItem value=''>Select Status</MenuItem>
              <MenuItem value='Scheduled'>Scheduled</MenuItem>
              <MenuItem value='Published'>Publish</MenuItem>
              <MenuItem value='Inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='category-select'>Category</InputLabel>
            <Select
              fullWidth
              id='select-category'
              // value={category}
              // onChange={e => setCategory(e.target.value)}
              label='Category'
              labelId='category-select'
            >
              <MenuItem value=''>Select Category</MenuItem>
              <MenuItem value='Accessories'>Accessories</MenuItem>
              <MenuItem value='Home Decor'>Home Decor</MenuItem>
              <MenuItem value='Electronics'>Electronics</MenuItem>
              <MenuItem value='Shoes'>Shoes</MenuItem>
              <MenuItem value='Office'>Office</MenuItem>
              <MenuItem value='Games'>Games</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='stock-select'>Stock</InputLabel>
            <Select
              fullWidth
              id='select-stock'
              // value={stock}
              // onChange={e => setStock(e.target.value as string)}
              label='Stock'
              labelId='stock-select'
            >
              <MenuItem value=''>Select Stock</MenuItem>
              <MenuItem value='In Stock'>In Stock</MenuItem>
              <MenuItem value='Out of Stock'>Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
