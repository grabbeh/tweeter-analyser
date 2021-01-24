/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, Text } from 'theme-ui'
import { ResponsiveBar } from '@nivo/bar'
import { ThemeProvider } from '@nivo/core'
import ScrollAnimation from 'components/animations/scrollanimation'

const Chart = ({ chartData }) => (
  <ScrollAnimation>
    <Box
      sx={{
        py: 3,
        px: [2, 3],
        borderRadius: '30px',
        bg: 'light-gray',
        mt: 4,
        height: '900px'
      }}
    >
      <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>Hours</Text>
      <Text as='p'>High volume throughout the day speaks for itself</Text>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </Box>
  </ScrollAnimation>
)

export default Chart

const theme = {
  background: 'transparent',
  fontFamily: 'Segoe UI',
  fontSize: 11,
  textColor: '#333333',
  axis: {
    domain: {
      line: {
        stroke: 'transparent',
        strokeWidth: 1
      }
    },
    ticks: {
      line: {
        stroke: '#777777',
        strokeWidth: 1
      },
      text: {}
    },
    legend: {
      text: {
        fontSize: 12
      }
    }
  },
  grid: {
    line: {
      stroke: '#dddddd',
      strokeWidth: 1
    }
  },
  legends: {
    text: {
      fill: '#333333'
    }
  },
  labels: {
    text: {}
  },
  markers: {
    lineColor: '#000000',
    lineStrokeWidth: 1,
    text: {}
  },
  dots: {
    text: {}
  },
  tooltip: {
    container: {
      background: 'white',
      color: 'inherit',
      fontSize: 'inherit',
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
      padding: '5px 9px'
    },
    basic: {
      whiteSpace: 'pre',
      display: 'flex',
      alignItems: 'center'
    },
    table: {},
    tableCell: {
      padding: '3px 5px'
    }
  },
  crosshair: {
    line: {
      stroke: '#000000',
      strokeWidth: 1,
      strokeOpacity: 0.75,
      strokeDasharray: '6 6'
    }
  },
  annotations: {
    text: {
      fontSize: 13,
      outlineWidth: 2,
      outlineColor: '#ffffff'
    },
    link: {
      stroke: '#000000',
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: '#ffffff'
    },
    outline: {
      fill: 'none',
      stroke: '#000000',
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: '#ffffff'
    },
    symbol: {
      fill: '#000000',
      outlineWidth: 2,
      outlineColor: '#ffffff'
    }
  }
}
