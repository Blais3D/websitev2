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
import { MdOutlineBackspace, MdSecurityUpdateWarning } from "react-icons/md";
import { type } from "os";

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
  keyLetterArray: KeyLetter[] = new Array<KeyLetter>();

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
        this.keyLetterArray.push(
          new KeyLetter(this.letters[i].current, LetterStatus.Correct)
        );
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
        this.keyLetterArray.push(
          new KeyLetter(this.letters[i].current, LetterStatus.Not)
        );
      }
    }

    for (var i = 0; i < this.letters.length; i++) {
      if (this.letters[i].current == LetterStatus.Floating) {
        if (theWordsLetters.includes(this.letters[i].character)) {
          this.letters[i].current = LetterStatus.Somewhere;
          this.keyLetterArray.push(
            new KeyLetter(this.letters[i].current, LetterStatus.Somewhere)
          );
          theWordsLetters[theWordsLetters.indexOf(this.letters[i].character)] =
            ".";
        } else {
          this.letters[i].current = LetterStatus.Not;
          this.keyLetterArray.push(
            new KeyLetter(this.letters[i].current, LetterStatus.Not)
          );
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

class KeyLetter {
  letter: string;
  status: LetterStatus = LetterStatus.Floating;

  constructor(letter: string, status: LetterStatus) {
    this.letter = letter;
  }

  statusSetter(status: LetterStatus) {
    this.status = status;
  }
}

class Game {
  words: Word[] = new Array<Word>(6);
  thisGame: GameStatus = GameStatus.StillGoing;
  theWord: string;
  currentStep: number = 0;
  currentLetter: number = 0;
  turns: number = 5;
  letterArray: string[] = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  keyLetterArray: LetterStatus[] = new Array<LetterStatus>();

  constructor(theWord: string) {
    for (var i = 0; i < this.words.length; i++) {
      this.words[i] = new Word();
    }
    this.theWord = theWord;
    for (var i = 0; i < this.letterArray.length; i++) {
      this.keyLetterArray.push(LetterStatus.Floating);
    }
  }

  lockInCurrentWord(): void {
    if (this.words[this.currentStep].lockIt(this.theWord)) {
      this.thisGame = GameStatus.Won;
    } else if (this.currentStep > this.turns - 1) {
      this.thisGame = GameStatus.Lost;
    } else {
      this.thisGame = GameStatus.StillGoing;
    }
    this.updateKeyLetters();
    this.currentStep = this.currentStep + 1;
  }

  updateKeyLetters() {
    let updated: KeyLetter[] = this.words[this.currentStep].keyLetterArray;
    for (var i = 0; i < updated.length; i++) {
      this.keyLetterArray[this.letterArray.indexOf(updated[i].letter)] =
        updated[i].status;
    }
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
    keyPresser(event.key);
  };

  const [board, setboard] = useState(<BoardSetter currentGame={newGame} />);

  function refreshPage() {
    window.location.reload();
  }

  function keyPresser(keyString: string) {
    if (newGame.thisGame == GameStatus.StillGoing) {
      if (
        enteredText.length < 5 &&
        newGame.letterArray.includes(keyString.toUpperCase())
      ) {
        setEnteredText(enteredText + keyString);
        newGame.setLetter(keyString.toUpperCase());
        newGame.currentLetter++;
      }
      if (keyString == "Backspace" && enteredText.length > 0) {
        setEnteredText(enteredText.substring(0, enteredText.length - 1));
        newGame.currentLetter--;
        newGame.setLetter("");
      }
      if (keyString == "Enter" && enteredText.length == 5) {
        if (myWordsArray.includes(enteredText.toLowerCase())) {
          newGame.lockInCurrentWord();
          setEnteredText("");
          newGame.currentLetter = 0;
        }
      }
      //updateAll();
      setboard(<BoardSetter currentGame={newGame} />);
    }
    if (newGame.thisGame != GameStatus.StillGoing) {
      setDisplayMessage(" The Word Was: " + theWord);
    }
  }

  const KeyOnKeyboard: React.FC<{
    currentLetter: string;
  }> = (props) => {
    const color: string =
      newGame.keyLetterArray[newGame.letterArray.indexOf(props.currentLetter)];
    return (
      <div
        className=" w-10 h-14 bg-[#212121] rounded flex place-content-center place-items-center"
        style={{ background: color }}
      >
        <button
          className="w-10 h-14 text-base text-white text-center"
          onClick={() => keyPresser(props.currentLetter)}
        >
          {props.currentLetter}
        </button>
      </div>
    );
  };

  const KeyOnKeyboardEvent: React.FC<{
    text: any;
    word: string;
  }> = (props) => {
    return (
      <div className=" w-16 h-14 bg-[#212121] rounded-md flex place-content-center place-items-center">
        <button
          className=" w-16 h-14 text-base text-white text-center flex place-content-center place-items-center"
          onClick={() => keyPresser(props.word)}
        >
          {props.text}
        </button>
      </div>
    );
  };

  const [keyA, setkeyA] = useState(<KeyOnKeyboard currentLetter={"A"} />);
  const [keyB, setkeyB] = useState(<KeyOnKeyboard currentLetter={"B"} />);
  const [keyC, setkeyC] = useState(<KeyOnKeyboard currentLetter={"C"} />);
  const [keyD, setkeyD] = useState(<KeyOnKeyboard currentLetter={"D"} />);
  const [keyE, setkeyE] = useState(<KeyOnKeyboard currentLetter={"E"} />);
  const [keyF, setkeyF] = useState(<KeyOnKeyboard currentLetter={"F"} />);
  const [keyG, setkeyG] = useState(<KeyOnKeyboard currentLetter={"G"} />);
  const [keyH, setkeyH] = useState(<KeyOnKeyboard currentLetter={"H"} />);
  const [keyI, setkeyI] = useState(<KeyOnKeyboard currentLetter={"I"} />);
  const [keyJ, setkeyJ] = useState(<KeyOnKeyboard currentLetter={"J"} />);
  const [keyK, setkeyK] = useState(<KeyOnKeyboard currentLetter={"K"} />);
  const [keyL, setkeyL] = useState(<KeyOnKeyboard currentLetter={"L"} />);
  const [keyM, setkeyM] = useState(<KeyOnKeyboard currentLetter={"M"} />);
  const [keyN, setkeyN] = useState(<KeyOnKeyboard currentLetter={"N"} />);
  const [keyO, setkeyO] = useState(<KeyOnKeyboard currentLetter={"O"} />);
  const [keyP, setkeyP] = useState(<KeyOnKeyboard currentLetter={"P"} />);
  const [keyQ, setkeyQ] = useState(<KeyOnKeyboard currentLetter={"Q"} />);
  const [keyR, setkeyR] = useState(<KeyOnKeyboard currentLetter={"R"} />);
  const [keyS, setkeyS] = useState(<KeyOnKeyboard currentLetter={"S"} />);
  const [keyT, setkeyT] = useState(<KeyOnKeyboard currentLetter={"T"} />);
  const [keyU, setkeyU] = useState(<KeyOnKeyboard currentLetter={"U"} />);
  const [keyV, setkeyV] = useState(<KeyOnKeyboard currentLetter={"V"} />);
  const [keyW, setkeyW] = useState(<KeyOnKeyboard currentLetter={"W"} />);
  const [keyX, setkeyX] = useState(<KeyOnKeyboard currentLetter={"X"} />);
  const [keyY, setkeyY] = useState(<KeyOnKeyboard currentLetter={"Y"} />);
  const [keyZ, setkeyZ] = useState(<KeyOnKeyboard currentLetter={"Z"} />);
  const [keyEnter, setkeyEnter] = useState(
    <KeyOnKeyboardEvent text={"Enter"} word={"Enter"} />
  );
  const [keyDelete, setkeyDelete] = useState(
    <KeyOnKeyboardEvent
      text={<MdOutlineBackspace size={30} />}
      word={"Backspace"}
    />
  );

  function updateAll() {
    setkeyA(<KeyOnKeyboard currentLetter={"A"} />);
    setkeyB(<KeyOnKeyboard currentLetter={"B"} />);
    setkeyC(<KeyOnKeyboard currentLetter={"C"} />);
    setkeyD(<KeyOnKeyboard currentLetter={"D"} />);
    setkeyE(<KeyOnKeyboard currentLetter={"E"} />);
    setkeyF(<KeyOnKeyboard currentLetter={"F"} />);
    setkeyG(<KeyOnKeyboard currentLetter={"G"} />);
    setkeyH(<KeyOnKeyboard currentLetter={"H"} />);
    setkeyI(<KeyOnKeyboard currentLetter={"I"} />);
    setkeyJ(<KeyOnKeyboard currentLetter={"J"} />);
    setkeyK(<KeyOnKeyboard currentLetter={"K"} />);
    setkeyL(<KeyOnKeyboard currentLetter={"L"} />);
    setkeyM(<KeyOnKeyboard currentLetter={"M"} />);
    setkeyN(<KeyOnKeyboard currentLetter={"N"} />);
    setkeyO(<KeyOnKeyboard currentLetter={"O"} />);
    setkeyP(<KeyOnKeyboard currentLetter={"P"} />);
    setkeyQ(<KeyOnKeyboard currentLetter={"Q"} />);
    setkeyR(<KeyOnKeyboard currentLetter={"R"} />);
    setkeyS(<KeyOnKeyboard currentLetter={"S"} />);
    setkeyT(<KeyOnKeyboard currentLetter={"T"} />);
    setkeyU(<KeyOnKeyboard currentLetter={"U"} />);
    setkeyV(<KeyOnKeyboard currentLetter={"V"} />);
    setkeyW(<KeyOnKeyboard currentLetter={"W"} />);
    setkeyX(<KeyOnKeyboard currentLetter={"X"} />);
    setkeyY(<KeyOnKeyboard currentLetter={"Y"} />);
    setkeyZ(<KeyOnKeyboard currentLetter={"Z"} />);
  }

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
              {keyQ}
              {keyW}
              {keyE}
              {keyR}
              {keyT}
              {keyY}
              {keyU}
              {keyI}
              {keyO}
              {keyP}
            </div>
            <div className=" place-content-center place-items-center flex space-x-2">
              {keyA}
              {keyS}
              {keyD}
              {keyF}
              {keyG}
              {keyH}
              {keyJ}
              {keyK}
              {keyL}
            </div>
            <div className=" place-content-center place-items-center flex space-x-2">
              {keyEnter}
              {keyZ}
              {keyX}
              {keyC}
              {keyV}
              {keyB}
              {keyN}
              {keyM}
              {keyDelete}
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
