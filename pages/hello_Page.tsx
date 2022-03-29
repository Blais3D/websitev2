import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";

const Home: NextPage = () => {
  return (
    <html>
      <body>
        <div className="bg-white h-device w-device">
          <h1 className="font-bold">Hello World!</h1>
        </div>
      </body>
    </html>
  );
};

export default Home;
