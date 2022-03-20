import type { AppProps } from 'next/app'
import './index.css'


function MyApp({ Component, pageProps }: AppProps) {
  return (
  <html className="bg-[#190e0e]">
    <head>
      <title>Welcome!</title>
    </head>
    <body className="bg-[#F5BE9A] w-screen h-[100px] flex place-content-center place-items-center">
      <h1 className='font-extrabold text-4xl text-[#190e0e]'>Welcom to Blais.gg</h1>
    </body>
    <body className="w-screen place-content-end place-items-end">
    <img className="w-[100%]" src="/newWave.svg" alt="Nope"/>
    </body>
  </html>)
}

export default MyApp
