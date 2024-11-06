import { Grid, Stack, Typography } from '@mui/material'
import { Question } from '~/domain/designation'

const QuestionsList = ({ questions, term }: { questions: Question[]; term: string }) => (
  <Stack spacing={2}>
    {questions.map((question, questionIndex) => (
      <Stack
        key={`question-${questionIndex}`}
        spacing={2}
        padding={2}
        sx={{ backgroundColor: 'gray100', borderRadius: '8px' }}
      >
        <Typography variant="h6">
          {questionIndex + 1}
          {questionIndex + 1 === 1 ? 'ère' : 'ème'} {term}
        </Typography>
        <Typography>{question.content}</Typography>
        <Stack spacing={1}>
          {question.choices.map((choice, choiceIndex) => (
            <Stack direction={'row'} key={`question-choice-${choiceIndex}`} spacing={1}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Typography variant={'h6'} noWrap>
                    Bulletin {choiceIndex + 1} :
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>{choice.label}</Typography>
                </Grid>
              </Grid>
            </Stack>
          ))}
          <Grid container spacing={2}>
            <Grid item xs>
              <Typography variant={'h6'} noWrap>
                Bulletin blanc
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    ))}
  </Stack>
)

export default QuestionsList
