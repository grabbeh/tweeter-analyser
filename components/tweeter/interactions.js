/** @jsx jsx */
import { jsx, Grid, Box } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'
import { RepliesTo, Retweets } from './index'

const Interactions = ({ repliesTo, retweets }) => {
  return (
    <Box>
      {repliesTo ||
        (retweets && (
          <ScrollAnimation>
            <Box sx={{ mt: 4, p: 3, borderRadius: '20px', bg: 'orange' }}>
              <Toggle title='Popular interactions'>
                <Grid gap={[3, 4]} columns={[1, 2, 2]}>
                  {<RepliesTo repliesTo={repliesTo} />}
                  {<Retweets retweets={retweets} />}
                </Grid>
              </Toggle>
            </Box>
          </ScrollAnimation>
        ))}
    </Box>
  )
}

export default Interactions
