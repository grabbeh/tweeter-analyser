/** @jsx jsx */
import { jsx, Box, Flex } from 'theme-ui'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { useRouter } from 'next/router'
import Input from './input'
import Button from './button'
import Error from './error'

const GenericForm = props => {
  const { callbackUrl, doFetch, error } = props
  const router = useRouter()
  return (
    <Formik
      initialValues={{
        username: ''
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        username: string().required('Please provide a username')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        //setErrorHandler(() => error => setErrors(error))
        // setEndpoint(dataUrl)
        setErrors({
          username: false,
          serverError: false
        })
        let { username } = values
        doFetch({ username })
        if (error) {
          setErrors(error)
        }
        resetForm()
        const href = `${callbackUrl}?username=${username}`
        const as = href
        router.push(href, as, { shallow: true })
      }}
    >
      {props => {
        const { values, errors, touched, isSubmitting, handleChange } = props
        return (
          <Form>
            <Input
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              name='username'
              value={values.username}
              label='Twitter handle'
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
                  GO
                </Button>
              </Flex>
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default GenericForm
