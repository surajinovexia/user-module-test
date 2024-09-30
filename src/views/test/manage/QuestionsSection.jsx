import { Card, CardActions, CardContent, Grid, Typography } from '@mui/material'

const QuestionsSection = () => {
  const dummyData = [
    {
      icon: '/images/icons/badge.svg',
      title: 'All Questions'
    },
    {
      icon: '/images/icons/preview.svg',
      title: 'Preview Test'
    },
    {
      icon: '/images/icons/import.svg',
      title: 'Import Questions'
    },
    {
      icon: '/images/icons/test.svg',
      title: 'Take test as student'
    },
    {
      icon: '/images/icons/add.svg',
      title: 'Add Questions'
    }
  ]

  return (
    <Grid item container xs={6}>
      <Card>
        <CardContent>
          <Grid container xs={12} spacing={2}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: 18
                }}
              >
                Questions
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Mathematics Test</Typography>
            </Grid>
            <Grid item container xs={12}>
              {dummyData?.map(item => (
                <Grid key={item} item xs={6} display='flex' alignItems='center' p={2}>
                  <img
                    src={item?.icon}
                    alt='no_img'
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: 10
                    }}
                  />
                  <Typography
                    component='a'
                    href='https://example.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ textDecoration: 'underline', textUnderlineOffset: 3 }} // Optional: to style the link
                  >
                    {item?.title}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Grid>
  )
}

export default QuestionsSection
