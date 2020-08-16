import React from 'react'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { useRouter } from 'next/router'
import Box from './Box'
import Flex from './Flex'
import Input from './Input'
import Button from './Button'
import Error from './Error'
import { server } from '../config/index'

const InputForm = props => {
  const { setLoading, setData } = props
  const router = useRouter()
  return (
    <Formik
      initialValues={{
        username: ''
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        username: string().required('Please provide a twitter username!')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        setData(false)
        setLoading(true)
        setErrors({
          username: false,
          serverError: false
        })
        let { username } = values
        fetch(`${server}/get-tweeter-data`, {
          method: 'POST',
          body: JSON.stringify({ username })
        })
          .then(r => r.json())
          .then(json => {
            setData(json.Item)
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
              // serverError: 'Server error'
              serverError: error
            })
            setLoading(false)
          })
        const href = `/form?username=${username}`
        const as = href
        router.push(href, as, { shallow: true })
      }}
    >
      {props => {
        const { values, errors, touched, isSubmitting, handleChange } = props
        return (
          <Box mt={2}>
            <Form>
              <Input
                style={{ boxSizing: 'border-box' }}
                onChange={handleChange}
                name='username'
                value={values.username}
                label='Please input a username'
                error={errors.username}
              />
              <Box mt={1}>
                {touched.username && (
                  <Error>{errors.username || errors.serverError}</Error>
                )}
              </Box>
              <Box mt={3}>
                <Flex justifyContent='flex-end'>
                  <Button disabled={isSubmitting} type='submit'>
                    Submit
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
