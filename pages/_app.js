// pages/_app.js
import '../index.css'
import React from 'react'

export default function App({ Component, pageProps }) {
	return <Component {...pageProps} />
}
