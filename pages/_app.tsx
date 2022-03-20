import type { AppProps } from 'next/app'
import './index.css'


function MyApp({ Component, pageProps }: AppProps) {
  return (
  <html className="bg-[#190e0e]">
    <head>
      <title>Welcome!</title>
    </head>
    <body>
    <div className="bg-[#F5BE9A] w-screen h-[100px] space-y-10 text-center" >
      <p className='font-extrabold text-4xl text-[#190e0e]'>Welcom to Blais.gg</p>
      <img className="w-[100%]" src="/newWave.svg" alt="Nope"/>
    </div>
    </body>
    
  </html>)
}

export default MyApp
