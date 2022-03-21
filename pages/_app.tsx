import type { AppProps } from 'next/app'
import './index.css'
import {FaTwitterSquare, FaYoutubeSquare, FaGithubSquare, FaDiscord } from 'react-icons/fa'
import {MdMarkEmailUnread } from 'react-icons/md'
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';

const MyButton: React.FC<{icon: any, link: string, size: number, text: string}> = (props) => {
  return (
    <a className='text-[#F5BE9A] hover:text-gray-400 flex place-content-center place-items-center' href={props.link}>
      <p className='font-extrabold text-3xl'>{props.text}</p>
      <FaTwitterSquare size={props.size}/>
    </a>
  );
};

const MyDiv: React.FC<{inside: any}> = (props) => {
  return(
    <div className='bg-[#311415] h-[700px] w-[600px] rounded-3xl p-5 text-center space-y-5'>
      {props.inside}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <html className="bg-[#190e0e]">
    <head>
      <title>Welcome!</title>
    </head>
    <body>
    <div className="bg-[#F5BE9A] w-screen h-auto text-center" >
      <div className='text-center place-content-center place-items-center p-10'>
      <p className='font-extrabold text-5xl text-[#190e0e]'>Welcome to Blais.gg</p>
      </div>
      <img className="w-[100%]" src="/newWave.svg" alt="Nope"/>
    </div>
    <div className='text-center'>
      <p className='font-extrabold text-4xl text-[#F5BE9A]'>Socials</p>
    </div>
    <div className='flex place-content-center place-items-center'>
      <div className='block p-10 space-y-10'>
        <MyDiv inside={
                  <>
                  <MyButton icon={FaTwitterSquare} link={'https://twitter.com/LinwoodBlais'} size={45} text={"Twitter"} />
                  <TwitterTimelineEmbed sourceType="profile" screenName="linwoodblais" options={{ height: 575, width: 450 }} />
                  </>}>
        </MyDiv>
        <div className='bg-[#311415] h-[700px] w-[600px] rounded-3xl p-5'></div>
      </div>
      <div className='block p-10 space-y-10'>
        <div className='bg-[#311415] h-[700px] w-[600px] rounded-3xl p-5'></div>
        <div className='bg-[#311415] h-[700px] w-[600px] rounded-3xl p-5'></div>
      </div>
    </div>
    </body>
  </html>)
}

export default MyApp
