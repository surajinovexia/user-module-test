'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

import { useTheme } from '@mui/material/styles'

import TestCardItems from './TestCardItems'
import QuestionsSection from './QuestionsSection'

const UserListCards = () => {
  const theme = useTheme()

  console.info(theme.palette.customColors.testCardColors1)

  const data = [
    {
      stats: '7',
      avatarColor: theme.palette.customColors.testCardColors1,
      subtitle: 'Total User',
      linkheading1: 'With Correct answer',
      linkheading2: 'Without Correct answer'
    },
    {
      stats: '2/25',
      avatarColor: theme.palette.success.main,
      subtitle: 'Submissions/Users',
      linkheading1: 'Not Published'
    },
    {
      stats: '4/24',
      avatarColor: theme.palette.customColors.testCardColors2,
      subtitle: 'Submissions/Users',
      linkheading1: 'Pending Correction'
    },
    {
      stats: '3',
      avatarColor: theme.palette.warning.main,
      subtitle: 'Questions',
      linkheading1: 'Attempts in progress'
    }
  ]

  return (
    <Grid container xs={12}>
      <Grid container spacing={6}>
        {data.map((item, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}>
            <TestCardItems {...item} />
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} mt={10}>
        <QuestionsSection />
      </Grid>
    </Grid>
  )
}

export default UserListCards
