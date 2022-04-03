import type { AppProps } from "next/app";
import {
  FaTwitterSquare,
  FaYoutubeSquare,
  FaGithubSquare,
  FaDiscord,
  FaLinkedin,
} from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";

const MyButton: React.FC<{
  icon: any;
  link: string;
  size: number;
  text: string;
}> = (props) => {
  if (props.icon == null) {
    return (
      <a
        className="text-[#F5BE9A] flex place-content-center place-items-center transition 
        ease-in-out delay-150 hover:text-[#7d1a1d] hover:-translate-y-1 hover:scale-110"
        href={props.link}
        target="_blank"
        rel="noreferrer"
      >
        <p className="font-extrabold text-3xl">{props.text}</p>
      </a>
    );
  } else {
    return (
      <a
        className="text-[#F5BE9A] flex place-content-center place-items-center transition 
        ease-in-out delay-150 hover:text-[#7d1a1d] hover:-translate-y-1 hover:scale-110"
        href={props.link}
        target="_blank"
        rel="noreferrer"
      >
        <p className="font-extrabold text-3xl">{props.text}</p>
        <props.icon size={props.size} />
      </a>
    );
  }
};

const PageButtons: React.FC<{
  link: string;
  text: string;
}> = (props) => {
  return (
    <Link href={"/hello_Page"}>
      <a>Test</a>
    </Link>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html>
      <Head>
        <title>Welcome!</title>
      </Head>
      <body className="scrollbar-hide">
        <div className="h-device w-device">
          <div className="bg-[#F5BE9A] text-center ">
            <div className="text-center place-content-center place-items-center p-10">
              <p className="font-extrabold text-6xl text-[#190e0e]">
                Welcome to Blais.gg
              </p>
            </div>
            <img className="w-[100%]" src="/newWave.svg" alt="Nope" />
          </div>
          <div className="text-center p-[4%] bg-[#190e0e]">
            <p className="font-extrabold text-5xl text-[#F5BE9A]">Socials</p>
          </div>
          <div className="p-[4%] flex flex-wrap place-content-center space-x-[2%] bg-[#190e0e]">
            <MyButton
              icon={FaTwitterSquare}
              link={"https://twitter.com/LinwoodBlais"}
              size={45}
              text={"Twitter "}
            />
            <MyButton
              icon={FaLinkedin}
              link={"https://www.linkedin.com/in/linwoodblaisdell/"}
              size={45}
              text={"Linked "}
            />
            <MyButton
              icon={FaDiscord}
              link={"https://discordapp.com/users/Blais#7790"}
              size={45}
              text={"Discord "}
            />
            <MyButton
              icon={FaGithubSquare}
              link={"https://github.com/Blais3D"}
              size={45}
              text={"GitHub  "}
            />
          </div>
          <img className="w-[100%]" src="/waveLower.svg" alt="Nope" />
          <div className="pb-[3%] w-[100%] bg-[#311415] text-center">
            <p className="font-extrabold text-5xl text-[#F5BE9A]">Projects</p>
          </div>
          <div className="p-[4%] flex flex-wrap place-content-center space-x-[2%] bg-[#311415] text-center">
            <Link href={"/linwordle"}>
              <MyButton
                icon={null}
                link={"/linwordle"}
                size={0}
                text={"Play LinWordle!"}
              />
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

export default MyApp;
