import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'

import TextEditor from '@/components/Common/TextEditor'

const QuestionFeedback = ({ setFeedback, setAnswerFeedback }) => {
  return (
    <Grid item xs={12} py={4}>
      <Card>
        <CardContent>
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Typography fontWeight='bold' pb={3}>
                Feedback For Student
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextEditor setTextValue={setFeedback} />
            </Grid>
          </Grid>
          <Grid container item xs={12} pt={6}>
            <Grid item xs={12}>
              <Typography fontWeight='bold' pb={3}>
                Answer Feedback (For Instructor Only)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextEditor setTextValue={setAnswerFeedback} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default QuestionFeedback
