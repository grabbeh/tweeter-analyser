import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Flex, Button, Text } from 'theme-ui'
import Error from './error'
import { MdRefresh } from 'react-icons/md'

const InputForm = (props) => {
	const { username, doFetch, error } = props
	return (
		<Formik
			initialValues={{
				username: ''
			}}
			onSubmit={(values, { setErrors, resetForm }) => {
				setErrors({
					serverError: false
				})
				doFetch({ username, refresh: true })
				if (error) {
					setErrors(error)
				}
				resetForm()
			}}
		>
			{(props) => {
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
