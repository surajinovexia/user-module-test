'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { Box, Card, CardContent, FormControlLabel, Grid, IconButton, Radio, Typography } from '@mui/material'

import Select from '@mui/material/Select'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'

import useTestApi from '@/api/useTestApi'

// API import

const EditTest = ({ isLoading = false }) => {
  const [types, setTypes] = useState(null)
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const router = useRouter()

  //   const [data, setData] = useState(null)

  // useForm hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm()

  const { data, testData, viewTest, updateTestData } = useTestApi()

  // Fetch data and populate form on component mount
  useEffect(() => {
    if (guid) {
      viewTest(guid).then(res => {
        setTypes(String(res?.data?.payload?.type))
        reset({
          title: res?.data?.payload?.title,
          type: res?.data?.payload?.type,
          details: res?.data?.payload?.details
        })
      })
    }
  }, [guid, reset])

  const handleFormSubmit = async data => {
    updateTestData(guid, { ...data, type: types })
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={5} xs={12}>
          <Grid item xs={12} display='flex' alignItems='center'>
            <IconButton onClick={() => router.push('/test/list')}>
              <i class='ri-arrow-left-line'></i>
            </IconButton>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 18
              }}
            >
              Edit Test
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                paddingTop: 5,
                paddingBottom: 10
              }}
            >
              <CardContent>
                <Grid item xs={12} py={3}>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label='Title'
                        InputLabelProps={{
                          shrink: true
                        }}
                        {...field}
                        error={Boolean(errors.title)}
                        helperText={errors.title ? errors.title.message : ''}
                      />
                    )}
                  />

                  {/* <FormControl fullWidth>
                    <label>Title</label>
                    <Controller
                      name='title'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={Boolean(errors.title)}
                          helperText={errors.title ? errors.title.message : ''}
                        />
                      )}
                    />
                  </FormControl> */}
                </Grid>
                <Grid item xs={12} py={3}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <label>Description</label>
                    <Controller
                      name='details'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          rows={4}
                          error={Boolean(errors.details)}
                          helperText={errors.details ? errors.details.message : ''}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} py={3}>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        select
                        {...field}
                        label='Type'
                        labelId='typeLabel'
                        error={Boolean(errors.type)}
                        value={types}
                        onChange={e => setTypes(e?.target?.value)}
                        InputLabelProps={{
                          shrink: true
                        }}

                        // key={data ? data.type : 'loading'} // Force re-render when data is fetched
                      >
                        <MenuItem value='evaluated'>Evaluated</MenuItem>
                        <MenuItem value='practice'>Practice</MenuItem>
                        <MenuItem value='quiz'>Quiz</MenuItem>
                      </TextField>
                    )}
                  />
                  {errors.type && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-test-type'>
                      {errors.type.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} py={3}>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Radio
                            {...field}
                            size='medium'
                            value={field?.type}
                            // eslint-disable-next-line lines-around-comment
                            // checked={field.choice}
                            checked={field?.type === 'evaluated' ? true : false}
                          />
                        }
                        label='Evaluated'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
                  <Button size='large' type='submit' variant='contained' disabled={isLoading} sx={{ mr: 2 }}>
                    {isLoading && <CircularProgress color='inherit' size={20} sx={{ mr: 2 }} />}
                    Save Changes
                  </Button>
                  {/* <Button size='large' variant='outlined' color='secondary' onClick={() => {}}>
              Cancel
            </Button> */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default EditTest
