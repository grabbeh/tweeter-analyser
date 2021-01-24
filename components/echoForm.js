/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, Flex } from 'theme-ui'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { useRouter } from 'next/router'
import Input from './input'
import Button from './button'
import Error from './error'
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
        fetch(`${server}/get-followed-view`, {
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
              // serverError: 'Server error'
              serverError: error
            })
            setLoading(false)
          })
        const href = `/echo?username=${username}`
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

export default InputForm
