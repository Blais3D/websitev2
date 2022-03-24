import type { AppProps } from 'next/app'
import './index.css'
import {FaTwitterSquare, FaYoutubeSquare, FaGithubSquare, FaDiscord, FaLinkedin} from 'react-icons/fa'
import {MdMarkEmailUnread } from 'react-icons/md'
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';

const MyButton: React.FC<{icon: any, link: string, size: number, text: string}> = (props) => {
  return (
    <a className='text-[#F5BE9A] hover:text-[#7d1a1d] flex place-content-center place-items-center' href={props.link}>
      <p className='font-extrabold text-3xl'>{props.text}</p>
      <props.icon size={props.size}/>
    </a>
  );
};

const MyDiv: React.FC<{inside: any}> = (props) => {
  return(
    <div className='bg-[#311415] h-auto w-[90%] rounded-3xl p-5 text-center space-y-5'>
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
    <body className="scrollbar-hide">
    <div className="bg-[#F5BE9A] text-center" >
      <div className='text-center place-content-center place-items-center p-10'>
      <p className='font-extrabold text-6xl text-[#190e0e]'>Welcome to Blais.gg</p>
      </div>
      <img className="w-[100%]" src="/newWave.svg" alt="Nope"/>
    </div>
    <div className='text-center'>
      <p className='font-extrabold text-5xl text-[#F5BE9A]'>Socials</p>
    </div>
      <div className='pt-[5%] grid grid-cols-4 place-items-center'>
                    <MyButton icon={FaTwitterSquare} link={'https://twitter.com/LinwoodBlais'} size={45} text={"Twitter "} />
                    <MyButton icon={FaLinkedin} link={'https://www.linkedin.com/in/linwoodblaisdell/'} size={45} text={"LinkedIn "} />
                    <MyButton icon={FaDiscord} link={'https://discordapp.com/users/Blais#7790'} size={45} text={"Discord "} />
                    <MyButton icon={FaGithubSquare} link={'https://github.com/Blais3D'} size={45} text={"GitHub  "} />
      </div>
    </body>
  </html>)
}

export default MyApp
