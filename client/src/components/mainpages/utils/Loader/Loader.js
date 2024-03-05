import React, {useRef, useEffect} from 'react'
import { WifiLoader } from "react-awesome-loaders";
import { BoltLoader } from "react-awesome-loaders";
import { BoxesLoader } from "react-awesome-loaders";
import { SunspotLoader } from "react-awesome-loaders";
import './Loader.css'
function Loader() {
  return (
    <div className="page">
        <SunspotLoader
        gradientColors={["#000000	", "#FFFFFF"]}
        shadowColor={"#3730A3"}
        desktopSize={"130px"}
        mobileSize={"100px"}
      />
      </div>
      
      );
    }
    export default Loader;