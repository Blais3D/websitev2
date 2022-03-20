import type { AppProps } from 'next/app'
import './index.css'
import {FaTwitterSquare, FaYoutubeSquare, FaGithubSquare } from 'react-icons/fa'
import {MdMarkEmailUnread } from 'react-icons/md'

const MyButton: React.FC<{}> = (props) => {
  return (
    <div className=' fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow'>
      <MyButtonIcon icon={<FaTwitterSquare size={28}/>}/>
      <i>B</i>
      <i>C</i>
      <i>D</i>
    </div>
  );
};

const MyButtonIcon: React.FC<{icon: any}> = (props) => {
  return (
    <div className='sidebar-icon'>
      {props.icon}
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <html className="bg-[#190e0e]">
    <head>
      <title>Welcome!</title>
    </head>
    <body>
    <div className="bg-[#F5BE9A] w-screen h-[100px] space-y-10 text-center" >
      <div className='text-center'>
        
      <p className='font-extrabold text-4xl text-[#190e0e]'>Welcome to Blais.gg</p>
      </div>
      <img className="w-[100%]" src="/newWave.svg" alt="Nope"/>
    </div>
    </body>
    
  </html>)
}

export default MyApp
