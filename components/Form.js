import React from 'react'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { useRouter } from 'next/router'
import { Box, Flex } from 'theme-ui'
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
          .then(response => {
            if (response.status === 200) {
              return Promise.resolve(response.json()) // This will end up in SUCCESS part
            }
            return Promise.resolve(response.json()).then(responseInJson => {
              return Promise.reject(responseInJson.errorMessage) //  responseInJson.message = "Some nasty error message!"
            })
          })
          .then(
            result => {
              setData(result)
              setLoading(false)
              resetForm()
            },
            error => {
              setErrors({
                serverError: error
              })
            }
          )
          .catch(catchError => {
            setErrors({
              serverError: catchError
            })
          })
          .finally(() => {
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
          <Box sx={{ mt: 2 }}>
            <Form>
              <Input
                style={{ boxSizing: 'border-box' }}
                onChange={handleChange}
                name='username'
                value={values.username}
                label='Please input a username'
                error={errors.username}
              />
              <Box sx={{ mt: 1 }}>
                {touched.username && (
                  <Error>{errors.username || errors.serverError}</Error>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Flex sx={{ justifyContent: 'flex-end' }}>
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

const handleErrors = response => {
  if (!response.ok) {
    throw response
  }
  return response
}
