import React from 'react'

import { Formik, Form } from 'formik'
import { Box, Flex, Button, Text } from 'theme-ui'
import Error from './Error'
import { MdRefresh } from 'react-icons/md'
import { server } from '../config/index'

const InputForm = props => {
  const { setLoading, setData, username } = props
  return (
    <Formik
      initialValues={{
        username: ''
      }}
      onSubmit={(values, { setErrors, resetForm }) => {
        setData(null)
        setLoading(true)
        setErrors({
          serverError: false
        })
        fetch(`${server}/refresh-tweeter`, {
          method: 'POST',
          body: JSON.stringify({ username })
        })
          .then(r => r.json())
          .then(json => {
            setData(json)
            setLoading(false)
            resetForm()
          })
          .catch(err => {
            let error = 'Server error'
            if (!err.response) error = 'Server timeout'
            if (err.response && typeof err.response.data === 'string') {
              error = err.response.data
            }
            setErrors({
              serverError: error
            })
            setLoading(false)
          })
      }}
    >
      {props => {
        const { errors, touched, isSubmitting } = props
        return (
          <Box>
            <Form>
              <Box>
                {touched.username && <Error>{errors.serverError}</Error>}
              </Box>
              <Box>
                <Flex sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    sx={{
                      cursor: 'pointer',
                      p: 0,
                      bg: 'white',
                      color: 'black'
                    }}
                    disabled={isSubmitting}
                    type='submit'
                  >
                    <Text sx={{ fontWeight: 'bold', fontSize: 4 }}>
                      <MdRefresh />
                    </Text>
                  </Button>
                </Flex>
              </Box>
            </Form>
          </Box>
        )
      }}
    </Formik>
  )
}

export default InputForm
