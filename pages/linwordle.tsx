import { LookupAllOptions } from "dns";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, {
  AllHTMLAttributes,
  Component,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { KeyboardEvent } from "react";
import { myWordsArray } from "../func/generateWord";
import { MdOutlineBackspace } from "react-icons/md";

enum LetterStatus {
  Not = "#990000",
  Somewhere = "#999900",
  Correct = "#009900",
  Floating = "#111111",
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
    if (
      this.current == LetterStatus.Floating ||
      this.current == LetterStatus.Somewhere
    ) {
      if (compareTo[this.index] == this.character) {
        this.current = LetterStatus.Correct;
      } else if (compareTo.includes(this.character)) {
        this.current = LetterStatus.Somewhere;
      } else {
        this.current = LetterStatus.Not;
      }
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
    const theWordsLetters: string[] = theWord.split("");

    // set those letters that are in the right spot to true
    for (var i = 0; i < this.letters.length; i++) {
      if (theWordsLetters[i] == this.letters[i].character) {
        this.letters[i].current = LetterStatus.Correct;
        theWordsLetters[i] = ".";
      }
    }

    // get rid of leters that are not there
    for (var i = 0; i < this.letters.length; i++) {
      if (
        !theWordsLetters.includes(this.letters[i].character) &&
        this.letters[i].current == LetterStatus.Floating
      ) {
        this.letters[i].current = LetterStatus.Not;
      }
    }

    for (var i = 0; i < this.letters.length; i++) {
      if (this.letters[i].current == LetterStatus.Floating) {
        if (theWordsLetters.includes(this.letters[i].character)) {
          this.letters[i].current = LetterStatus.Somewhere;
          theWordsLetters[theWordsLetters.indexOf(this.letters[i].character)] =
            ".";
        } else {
          this.letters[i].current = LetterStatus.Not;
        }
      }
    }

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
  const [theWord, setTheWord] = useState(
    myWordsArray[
      Math.round(Math.random() * myWordsArray.length + 0.5)
    ].toUpperCase()
  );
  const [newGame, setNewGame] = useState(new Game(theWord));

  const [enteredText, setEnteredText] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");

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
    const color: string = props.currentLetter.current;
    return (
      <div
        className=" w-14 h-14 place-content-center place-items-center flex transition-colors duration-1000"
        style={{ background: color }}
      >
        <p className="text-white text-2xl">{props.currentLetter.character}</p>
      </div>
    );
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
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
        if (myWordsArray.includes(enteredText.toLowerCase())) {
          newGame.lockInCurrentWord();
          setEnteredText("");
          newGame.currentLetter = 0;
        }
      }
      setboard(<BoardSetter currentGame={newGame} />);
    }
    if (newGame.thisGame != GameStatus.StillGoing) {
      setDisplayMessage(" The Word Was: " + theWord);
    }
  };

  const [board, setboard] = useState(<BoardSetter currentGame={newGame} />);

  function refreshPage() {
    window.location.reload();
  }

  function keyPresser(keyString: string) {
    if (newGame.thisGame == GameStatus.StillGoing) {
      if (enteredText.length < 5 && keyString.length == 1) {
        setEnteredText(enteredText + keyString);
        newGame.setLetter(keyString.toUpperCase());
        newGame.currentLetter++;
      }
      if (keyString == "Backspace" && enteredText.length > 0) {
        setEnteredText(enteredText.substring(0, enteredText.length - 1));
        newGame.currentLetter--;
        newGame.setLetter(" ");
      }
      if (keyString == "Enter" && enteredText.length == 5) {
        if (myWordsArray.includes(enteredText.toLowerCase())) {
          newGame.lockInCurrentWord();
          setEnteredText("");
          newGame.currentLetter = 0;
        }
      }
      setboard(<BoardSetter currentGame={newGame} />);
    }
    if (newGame.thisGame != GameStatus.StillGoing) {
      setDisplayMessage(" The Word Was: " + theWord);
    }
  }

  const KeyOnKeyboard: React.FC<{
    currentLetter: string;
  }> = (props) => {
    return (
      <div className=" w-10 h-14 bg-[#212121] rounded flex place-content-center place-items-center">
        <button
          className=" text-base text-white text-center"
          onClick={() => keyPresser(props.currentLetter)}
        >
          {props.currentLetter}
        </button>
      </div>
    );
  };

  const KeyOnKeyboardEvent: React.FC<{
    currentLetter: any;
  }> = (props) => {
    return (
      <div className=" w-16 h-14 bg-[#212121] rounded-md flex place-content-center place-items-center">
        <button
          className=" text-base text-white text-center"
          onClick={() => keyPresser(props.currentLetter)}
        >
          {props.currentLetter}
        </button>
      </div>
    );
  };

  return (
    <html onKeyUpCapture={keyHandler} tabIndex={0}>
      <body className=" overflow-hidden h-screen w-screen">
        <div className=" bg-black h-[100%] w-[100%] text-center">
          <div className=" h-auto w-[100%] outline outline-1 outline-white">
            <p className="font-extrabold text-3xl text-white">LinWordle</p>
          </div>
          <div className=" space-y-2 p-2">
            {board}
            <div className=" place-content-center place-items-center flex space-x-2">
              <KeyOnKeyboard currentLetter={"Q"} />
              <KeyOnKeyboard currentLetter={"W"} />
              <KeyOnKeyboard currentLetter={"E"} />
              <KeyOnKeyboard currentLetter={"R"} />
              <KeyOnKeyboard currentLetter={"T"} />
              <KeyOnKeyboard currentLetter={"Y"} />
              <KeyOnKeyboard currentLetter={"U"} />
              <KeyOnKeyboard currentLetter={"I"} />
              <KeyOnKeyboard currentLetter={"O"} />
              <KeyOnKeyboard currentLetter={"P"} />
            </div>
            <div className=" place-content-center place-items-center flex space-x-2">
              <KeyOnKeyboard currentLetter={"A"} />
              <KeyOnKeyboard currentLetter={"S"} />
              <KeyOnKeyboard currentLetter={"D"} />
              <KeyOnKeyboard currentLetter={"F"} />
              <KeyOnKeyboard currentLetter={"G"} />
              <KeyOnKeyboard currentLetter={"H"} />
              <KeyOnKeyboard currentLetter={"J"} />
              <KeyOnKeyboard currentLetter={"K"} />
              <KeyOnKeyboard currentLetter={"L"} />
            </div>
            <div className=" place-content-center place-items-center flex space-x-2">
              <KeyOnKeyboardEvent currentLetter={"Enter"} />
              <KeyOnKeyboard currentLetter={"Z"} />
              <KeyOnKeyboard currentLetter={"X"} />
              <KeyOnKeyboard currentLetter={"C"} />
              <KeyOnKeyboard currentLetter={"V"} />
              <KeyOnKeyboard currentLetter={"B"} />
              <KeyOnKeyboard currentLetter={"N"} />
              <KeyOnKeyboard currentLetter={"M"} />
              <KeyOnKeyboardEvent
                currentLetter={<MdOutlineBackspace size={30} />}
              ></KeyOnKeyboardEvent>
            </div>
            <button
              onClick={refreshPage}
              className=" bg-[#212121] w-[10%] h-10 text-lg text-white transition hover:bg-[#555555] rounded-lg"
            >
              New Word!
            </button>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Home;
