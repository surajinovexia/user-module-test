'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
// eslint-disable-next-line import/no-duplicates
import { useSearchParams } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'

import { toast } from 'react-toastify'

import { useRole } from '@floating-ui/react'

import { Text } from 'recharts'

import TextEditor from '@/Components/Common/TextEditor'
import QuestionTypeAndTemplate from './QuestionTypeAndTemplate'
import QuestionFeedback from './QuestionFeedback'
import SaveQuestion from './SaveQuestion'
import McqQuestion from './McqQuestion'
import QuestionUpload from './QuestionUpload'
import TrueFalseQuestion from './TrueFalseQuestion'
import EssaysQuestion from './EssaysQuestion'
import QuestionSettings from './QuestionSettings'
import FilterHeader from '@/Components/globals/FilterHeader'
import { alertMessages } from '@/Components/globals/AlertMessages'
import useQuestionApi from '@/api/useQuestionApi'

const AddQuestion = () => {
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const { createQuestion, editQuestion, QId, questionTypeFixed } = useQuestionApi()
  const [questionType, setQuestionType] = useState('mcmc')
  const [saveQuestion, setSaveQuestion] = useState(false)
  const [editQuestions, setEditQuestions] = useState(false)
  const [template, setTemplate] = useState('template_1')
  const [unit, setUnit] = useState('second') // Default unit
  const theme = useTheme()

  const [mcqFields, setMcqFields] = useState([
    { id: 1, choice: '', correct_answer: false },
    { id: 2, choice: '', correct_answer: false }
  ])

  const [choiceFields, setChoiceFields] = useState([
    { id: 1, choice: 'true', correct_answer: false },
    { id: 2, choice: 'false', correct_answer: false }
  ])

  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    watch,
    register,
    setValue
  } = useForm({
    defaultValues: {
      question_type: 'mcmc',
      template: 'template_1',
      marks: '1',
      neg_marks: '0',
      timeValue: 'second',
      time: '',
      difficulty: '',
      importance: '',
      randomize_questions: false
    }
  })

  const selectedValue = watch('question_type')
  const [nquestion, setNQuestion] = useState('')

  console.info(nquestion)
  const [feedback, setFeedback] = useState('')
  const [answerFeedback, setAnswerFeedback] = useState('')

  console.info(nquestion)

  // console.info(selectedValue)

  const handleUnitChange = event => {
    setUnit(event.target.value)
  }

  console.info(mcqFields)

  const handleFormSubmit = async data => {
    if (selectedValue === 'mcmc') {
      const hasCorrectAnswer = mcqFields.some(choice => choice.correct_answer)

      if (!hasCorrectAnswer) {
        alertMessages(theme, 'error', 'Choose at least one option')

        return
      }
    }

    // setMcqFields(
    //   mcqFields.map(choice => ({
    //     ...choice,
    //     correct_answer: choice.correct_answer ? 1 : 0
    //   }))
    // )

    // data.choices = data.choices.map(choice => ({
    //   ...choice,
    //   correct_answer: choice.correct_answer ? 1 : 0
    // }));

    try {
      let response

      // if (editQuestions) {
      if (QId && editQuestions) {
        response = await editQuestion({
          guid,
          qId: QId,
          ...data,
          choices: selectedValue === 'mcmc' ? mcqFields : choiceFields,
          question: nquestion,
          feedback: feedback,
          answer_feedback: answerFeedback
        })
      } else {
        response = await createQuestion({
          guid,
          ...data,
          choices: selectedValue === 'mcmc' ? mcqFields : choiceFields,
          question: nquestion,
          feedback: feedback,
          answer_feedback: answerFeedback
        })
      }

      // if (response.success) {
      //   toast.success(response.message)
      // } else {
      //   toast.error(response.message)
      // }
    } catch (error) {
      console.error('Error during form submission:', error)

      // toast.error('An unexpected error occurred.')
    }
  }

  return (
    <>
      <FilterHeader title='Add Question' subtitle='Orders placed across your store' link='/test/list'></FilterHeader>
      <Grid container item xs={12}>
        {/* <Grid item xs={12} py={5} display='flex' alignItems='center'>
          <IconButton onClick={() => router.push('/en/test/list')}>
            <i class='ri-arrow-left-line'></i>
          </IconButton>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: 18
            }}
            pl={1}
          >
            Add Question
          </Typography>
        </Grid> */}
        <Grid item container xs={12}>
          <form
            // eslint-disable-next-line lines-around-comment
            // onSubmit={handleSubmit(data =>
            //   console.info({
            //     ...data,
            //     choices: mcqFields,
            //     question: nquestion,
            //     feedback: feedback,
            //     answer_feedback: answerFeedback
            //   })
            // )}
            onSubmit={handleSubmit(handleFormSubmit)}
            style={{
              width: '100vw'
            }}
          >
            <QuestionTypeAndTemplate control={control} errors={errors} questionTypeFixed={questionTypeFixed} />
            <Grid item xs={12} py={4}>
              <Card>
                <CardHeader title='Question' />
                <CardContent>
                  <Grid container xs={12}>
                    <Grid item xs={12}>
                      <Box>
                        <TextEditor setTextValue={setNQuestion} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} py={3}>
                      <QuestionUpload />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card
                sx={{
                  marginTop: 3
                }}
              >
                <CardContent>
                  <Grid item xs={12} py={3}>
                    <QuestionSettings control={control} errors={errors} />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              {selectedValue === 'mcmc' && (
                <McqQuestion mcqFields={mcqFields} setMcqFields={setMcqFields} control={control} />
              )}
              {selectedValue === 'tf' && (
                <TrueFalseQuestion choiceFields={choiceFields} setChoiceFields={setChoiceFields} />
              )}
              {selectedValue === 'essays' && <EssaysQuestion />}
            </Grid>
            <Grid container item xs={12}>
              <QuestionFeedback
                control={control}
                errors={errors}
                register={register}
                setValue={setValue}
                setFeedback={setFeedback}
                setAnswerFeedback={setAnswerFeedback}
              />
            </Grid>
            <Grid container item xs={12}>
              <SaveQuestion
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                setSaveQuestion={setSaveQuestion}
                setEditQuestion={setEditQuestions}
                setNQuestion={setNQuestion}
                setFeedback={setFeedback}
                setAnswerFeedback={setAnswerFeedback}
              />
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  )
}

export default AddQuestion
