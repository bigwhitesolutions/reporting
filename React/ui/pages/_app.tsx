import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import dynamic from 'next/dynamic'


const DynamicComponentWithNoSSR = dynamic(() => import('./index'), {
  ssr: false
})

export default function App({ pageProps }: AppProps) {
  return  <DynamicComponentWithNoSSR {...pageProps} />
}
