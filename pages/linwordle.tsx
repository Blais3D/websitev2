import { readFileSync } from "fs";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { Component, createContext, useState } from "react";
import { KeyboardEvent } from "react";

enum LetterStatus {
  Not = "#212121",
  Somewhere = "#999900",
  Correct = "#009900",
  Floating = "#212121",
}

enum GameStatus {
  StillGoing = "Keep Going!",
  Won = "You Won!",
  Lost = "You Lost",
}
class Letter {
  character: string = " ";
  current: LetterStatus = LetterStatus.Floating;
  index: number;

  constructor(index: number) {
    this.index = index;
  }

  decide(compareTo: string[]): void {
    if (compareTo[this.index] == this.character) {
      this.current = LetterStatus.Correct;
    } else if (compareTo.includes(this.character)) {
      this.current = LetterStatus.Somewhere;
    } else {
      this.current = LetterStatus.Not;
    }
  }
}

class Word {
  letters: Letter[] = new Array<Letter>(5);
  lockedIn: boolean = false;
  currentStep: number = 0;

  constructor() {
    for (var i = 0; i < this.letters.length; i++) {
      this.letters[i] = new Letter(i);
    }
  }

  lockIt(theWord: string): boolean {
    this.lockedIn = true;
    this.letters.forEach((l) => l.decide(theWord.split("")));
    var check: boolean = true;
    this.letters.forEach((item) => {
      if (item.current != LetterStatus.Correct) {
        check = false;
      }
    });
    return check;
  }
}

class Game {
  words: Word[] = new Array<Word>(6);
  thisGame: GameStatus = GameStatus.StillGoing;
  theWord: string;
  currentStep: number = 0;
  currentLetter: number = 0;
  turns: number = 5;

  constructor(theWord: string) {
    for (var i = 0; i < this.words.length; i++) {
      this.words[i] = new Word();
    }
    this.theWord = theWord;
  }

  lockInCurrentWord(): void {
    if (this.words[this.currentStep].lockIt(this.theWord)) {
      this.thisGame = GameStatus.Won;
    } else if (this.currentStep > this.turns - 1) {
      this.thisGame = GameStatus.Lost;
    } else {
      this.thisGame = GameStatus.StillGoing;
    }
    this.currentStep = this.currentStep + 1;
  }

  setLetter(key: string): void {
    this.words[this.currentStep].letters[this.currentLetter].character = key;
  }
}

const Home: NextPage = () => {
  var myText: string = "";

  fetch("www.blais.gg/words.txt").then(function (response) {
    response.text().then(function (text) {
      myText = text;
    });
  });

  const myArray = myText.split("/n");

  const [newGame, setNewGame] = useState(new Game("STATE"));

  const [enteredText, setEnteredText] = useState("");

  const BoardSetter: React.FC<{
    currentGame: Game;
  }> = (props) => {
    const wordComponents = new Array<JSX.Element>();
    props.currentGame.words.forEach((item) =>
      wordComponents.push(<WordSetter currentWord={item} />)
    );
    return (
      <div className="flex flex-col place-items-center p-[1%] bg-black">
        {wordComponents}
      </div>
    );
  };

  const WordSetter: React.FC<{
    currentWord: Word;
  }> = (props) => {
    const wordComponents = new Array<JSX.Element>();
    props.currentWord.letters.forEach((item) =>
      wordComponents.push(<LetterSetter currentLetter={item} />)
    );

    return (
      <div className=" bg-black flex flex-shrink space-x-2 p-1">
        {wordComponents}
      </div>
    );
  };

  const LetterSetter: React.FC<{
    currentLetter: Letter;
  }> = (props) => {
    return (
      <div
        className="w-[50px] h-[50px] place-content-center place-items-center flex"
        style={{ background: props.currentLetter.current }}
      >
        <p className=" text-white text-2xl">{props.currentLetter.character}</p>
      </div>
    );
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (newGame.thisGame == GameStatus.StillGoing) {
      if (enteredText.length < 5 && event.key.length == 1) {
        setEnteredText(enteredText + event.key);
        newGame.setLetter(event.key.toUpperCase());
        newGame.currentLetter++;
      }
      if (event.key == "Backspace" && enteredText.length > 0) {
        setEnteredText(enteredText.substring(0, enteredText.length - 1));
        newGame.currentLetter--;
        newGame.setLetter(" ");
      }
      if (event.key == "Enter" && enteredText.length == 5) {
        newGame.lockInCurrentWord();
        setEnteredText("");
        newGame.currentLetter = 0;
      }
      setboard(<BoardSetter currentGame={newGame} />);
    }
  };

  const [board, setboard] = useState(<BoardSetter currentGame={newGame} />);

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
          {board}
          <p className="font-extrabold text-6xl text-white">
            {newGame.thisGame}
          </p>
          <p className="font-extrabold text-6xl text-white">{myText}</p>
        </div>
      </body>
    </html>
  );
};

export default Home;
