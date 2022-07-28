/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Box, Flex } from 'theme-ui'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { useRouter } from 'next/router'
import Input from './input'
import Button from './button'
import Error from './error'
import { server } from '../config/index'

const InputForm = (props) => {
	const { setLoading, setData } = props
	const router = useRouter()
	return (
		<Formik
			initialValues={{
				url: ''
			}}
			validateOnChange={false}
			validationSchema={object().shape({
				url: string().required('Please provide a tweet URL!')
			})}
			onSubmit={(values, { setErrors, resetForm }) => {
				setData(false)
				setLoading(true)
				setErrors({
					url: false,
					serverError: false
				})
				let { url } = values
				let id = url.substring(url.lastIndexOf('/') + 1)

				fetch(`${server}/get-tweet-data`, {
					method: 'POST',
					body: JSON.stringify({ id })
				})
					.then((r) => r.json())
					.then((json) => {
						setData(json)
						setLoading(false)
						resetForm()
					})
					.catch((err) => {
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
				const href = `/tweet?id=${id}`
				const as = href
				router.push(href, as, { shallow: true })
			}}
		>
			{(props) => {
				const { values, errors, touched, isSubmitting, handleChange } = props
				return (
					<Box sx={{ mt: 2 }}>
						<Form>
							<Input
								style={{ boxSizing: 'border-box' }}
								onChange={handleChange}
								name='url'
								value={values.url}
								label='Please input a Tweet URL'
								error={errors.url}
							/>
							<Box sx={{ mt: 1 }}>
								{touched.url && (
									<Error>{errors.url || errors.serverError}</Error>
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
