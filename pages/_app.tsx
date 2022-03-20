import type { AppProps } from 'next/app'
import './index.css'

const MyButton: React.FC<{ text: String; color: string; link: any }> = (
  props
) => {
  return (
    <button className='' onClick={props.link}>
      {props.text}
    </button>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <html>
    <body className='bg-red-50'>
      <h1 className='font-bold underline '>
        Hello There
      </h1>
    </body>
  </html>)
  //return <Component {...pageProps} />
}

export default MyApp
