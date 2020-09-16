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
        height: '600px'
      }}
    >
      <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Split</Text>
      <Text sx={{ fontSize: 3 }}>
        A mixture of retweets and replies only is suggestive of bot activity
      </Text>
      <ResponsivePie
        data={pieData}
        margin={{ right: 50, top: 50, bottom: 200, left: 50 }}
        innerRadius={0.5}
        padAngle={5}
        cornerRadius={3}
        colors={{ scheme: 'category10' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor='#333333'
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor='#333333'
        animate
        motionStiffness={90}
        motionDamping={15}
        fill={[
          {
            match: {
              id: 'RETWEET'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'TWEET'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'REPLY'
            },
            id: 'dots'
          }
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </Box>
  </ScrollAnimation>
)

export default Pie
