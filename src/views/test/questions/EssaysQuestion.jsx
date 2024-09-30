import React, { useState } from 'react'

import { Card, CardHeader, CardContent, Grid, Radio, TextField, Typography } from '@mui/material'

import TextEditor from '@/components/Common/TextEditor'

const EssaysQuestion = () => {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Essays' />
          <CardContent>
            <Grid container item xs={12} pt={4}>
              <Grid item xs={1}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 500
                  }}
                  pl={1}
                >
                  Sample Answer
                </Typography>
              </Grid>
              <Grid item xs={11}>
                <TextEditor />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EssaysQuestion
