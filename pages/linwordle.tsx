import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { Component, createContext, useState } from "react";
import { KeyboardEvent } from "react";

const Home: NextPage = () => {
  let red = "#ff0000]";
  let green = "#00ff00";
  let gray = "#212121";
  let yellow = "#ffff00";
  const [currentLine, setCurrentLine] = useState(0);

  const [enteredText, setEnteredText] = useState("");

  const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (enteredText.length < 5 && event.key.length == 1) {
      setEnteredText(enteredText + event.key);
    }
    if (event.key == "Backspace" && enteredText.length > 0) {
      setEnteredText(enteredText.substring(0, enteredText.length - 1));
    }
    if (event.key == "Enter" && enteredText.length == 5) {
      setEnteredText("");
    }
  };

  const CreateLine: React.FC<{}> = (props) => {
    const wordComponents = new Array<JSX.Element>();
    for (let i = 0; i < 5; i++) {
      if (enteredText.split("").length > i) {
        wordComponents.push(
          <div
            className="h-[40px] w-[40px] flex place-content-center place-items-center text-Black"
            style={{ background: green }}
          >
            <p>{enteredText.split("").at(i)}</p>
          </div>
        );
      } else {
        wordComponents.push(
          <div
            className="h-[40px] w-[40px] flex place-content-center place-items-center text-Black"
            style={{ background: gray }}
          >
            <p>{enteredText.split("").at(i)}</p>
          </div>
        );
      }
    }

    return (
      <div className="p-[4%] flex flex-wrap place-content-center place-items-center space-x-[1%]">
        {wordComponents}
      </div>
    );
  };

  return (
    <html>
      <body className=" overflow-hidden h-screen w-screen">
        <div
          className=" bg-black h-[100%] w-[100%] text-center"
          tabIndex={0}
          onKeyUp={keyHandler}
        >
          <div>
            <p className="font-extrabold text-6xl text-white">
              Welcome to LinWordle
            </p>
          </div>
          <div>
            <CreateLine />
          </div>
        </div>
      </body>
    </html>
  );
};

export default Home;
