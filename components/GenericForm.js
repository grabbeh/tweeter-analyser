/** @jsx jsx */
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { useRouter } from 'next/router'
import { jsx, Box, Flex } from 'theme-ui'
import Input from './Input'
import Button from './Button'
import Error from './Error'

const GenericUsernameForm = props => {
  const {
    dataUrl,
    callbackUrl,
    setLoading,
    setData,
    doFetch,
    setEndpoint,
    error
  } = props

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
        setEndpoint(dataUrl)
        setData(false)
        setLoading(true)
        setErrors({
          username: false,
          serverError: false
        })
        let { username } = values
        doFetch(username)
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
          <Box>
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
          </Box>
        )
      }}
    </Formik>
  )
}

export default GenericUsernameForm
