import { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  Grid,
  CardContent,
  CardActions,
  TextField,
  Typography,
  FormControlLabel
} from '@mui/material'

import { Controller } from 'react-hook-form'

import TextEditor from '@/components/Common/TextEditor'

const McqQuestion = ({ mcqFields, setMcqFields, control, error }) => {
  // Function to handle input text change
  const handleInputChange = (index, content) => {
    const newFields = [...mcqFields]

    newFields[index].choice = content
    setMcqFields(newFields)
  }

  // Function to handle checkbox change
  const handleCheckboxChange = index => {
    const newFields = [...mcqFields]

    newFields[index].correct_answer = !newFields[index].correct_answer
    setMcqFields(newFields)
  }

  // Delete item from the list
  const deleteItem = index => {
    const newItems = mcqFields.filter((_, i) => i !== index)

    setMcqFields(newItems)
  }

  // Function to add a new text field and checkbox
  const addField = () => {
    const newField = { id: mcqFields.length + 1, choice: '', correct_answer: false, remove: true }

    setMcqFields([...mcqFields, newField])
  }

  console.info(mcqFields)

  return (
    <Grid item xs={12} py={4}>
      <Card>
        <CardHeader title='Answer Choices' />
        <CardContent>
          {mcqFields?.map((field, index) => (
            <Grid
              container
              item
              xs={12}
              key={field?.id}
              display='flex'
              justifyContent='flex-start'
              alignItems='flex-start'
              py={3}
            >
              <Grid item xs={0.5} p={1}>
                <Checkbox checked={field.correct_answer} onChange={() => handleCheckboxChange(index)} />
              </Grid>
              <Grid item xs={11}>
                <TextEditor text={field?.choice} handleInputChange={handleInputChange} index={index} />
              </Grid>
              <Grid
                item
                xs={0.5}
                p={2}
                onClick={() => deleteItem(index)}
                sx={{
                  cursor: 'pointer'
                }}
              >
                {field?.remove && <i class='ri-close-circle-line'></i>}
              </Grid>
            </Grid>
          ))}
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Controller
            name='randomize_questions'
            control={control}
            render={({ field }) => (
              <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label='Randomize Questions' />
            )}
          />

          <Button variant='outlined' color='primary' type='reset' onClick={addField}>
            Add Answer Choice
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default McqQuestion
