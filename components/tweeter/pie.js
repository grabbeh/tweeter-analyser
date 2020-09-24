/** @jsx jsx */
import { jsx, Box, Text } from 'theme-ui'
import { ResponsivePie } from '@nivo/pie'
import ScrollAnimation from 'components/animations/scrollanimation'

const Pie = ({ pieData }) => (
  <ScrollAnimation>
    <Box
      sx={{
        p: 3,
        borderRadius: '30px',
        bg: 'light-gray',
        mt: 4,
        height: '400px'
      }}
    >
      <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>Split</Text>
      <Text as='p'>
        A mixture of retweets and replies only is suggestive of bot activity
      </Text>
      <ResponsivePie
        data={pieData}
        margin={{ right: 100, bottom: 100, left: 100 }}
        innerRadius={0.5}
        padAngle={5}
        cornerRadius={3}
        colors={{ scheme: 'category10' }}
        startAngle={90}
        endAngle={-90}
      />
    </Box>
  </ScrollAnimation>
)

export default Pie
