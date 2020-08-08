import React from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'
import Text from '../components/Text'
import Box from './Box'

const FullTable = props => {
  let { dataRows } = props
  let picked = _.chain(dataRows)
    .map(d => {
      return d.licenses.map(l => {
        let author = 'Unknown'
        if (d.author && d.author.name) author = d.author.name
        return { name: d.name, license: l.license, author }
      })
    })
    .flatten()
    .map(r => {
      return _.pick(r, ['name', 'license', 'author'])
    })
    .value()

  let dataColumns = _.keys(picked[0])
  const tableHeaders = (
    <thead>
      <Tr>
        {dataColumns.map((column, i) => (
          <Td key={i}>
            <Text>{column}</Text>
          </Td>
        ))}
      </Tr>
    </thead>
  )

  const tableBody = picked.map((row, i) => (
    <Tr key={i}>
      {dataColumns.map((column, i) => (
        <Td key={i}>
          <Text size='l'>{row[column] || 'Unknown'}</Text>
        </Td>
      ))}
    </Tr>
  ))

  return (
    <Box my={3}>
      <Table>
        {tableHeaders}
        <tbody>{tableBody}</tbody>
      </Table>
    </Box>
  )
}

export default FullTable

const Tr = styled('tr')`
  border: 1px solid black;
  &:nth-of-type(even) {
    background: rgba(42, 117, 146, 0.12);
  }
`

const Table = styled('table')`
  table-layout: fixed;
  border-collapse: collapse;
  background: white;
`
/*
const Th = styled('th')`
  padding: 10px;
  width: 100px;
` */

const Td = styled('td')`
  padding: 5px;
  border: 1px solid black;
`
