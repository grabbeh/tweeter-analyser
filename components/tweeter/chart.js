/** @jsx jsx */
import { jsx, Box, Text } from 'theme-ui'
import { ResponsiveBar } from '@nivo/bar'
import ScrollAnimation from 'components/animations/scrollanimation'
const theme = {
  axis: {
    textColor: 'red',
    fontSize: '30px',
    fontFamily: 'Segoe UI',
    tickColor: 'red'
  }
}
const Chart = ({ chartData }) => (
  <ScrollAnimation>
    <Box
      sx={{
        p: 3,
        borderRadius: '30px',
        bg: 'light-gray',
        mt: 4,
        height: '900px'
      }}
    >
      <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Hours</Text>
      <Text sx={{ fontSize: 3 }}>
        High volume throughout the day speaks for itself
      </Text>
      <ResponsiveBar
        theme={theme}
        enableGridY={false}
        colors={{ scheme: 'category10' }}
        data={chartData.data}
        keys={chartData.keys}
        indexBy='time'
        margin={{ top: 20, bottom: 150, left: 65 }}
        padding={0.3}
        axisTop={null}
        axisRight={null}
        layout='horizontal'
        axisLeft={{
          tickSize: 5,
          tickPadding: 20,
          tickRotation: 30,
          legend: 'times (24 hour clock)',
          legendPosition: 'middle',
          legendOffset: -50
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 20,
          tickRotation: 0,
          legend: 'tweet volume',
          legendPosition: 'middle',
          legendOffset: 50
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor='white'
      />
    </Box>
  </ScrollAnimation>
)

export default Chart
