import { useEffect } from "react";
import LogoSvg from "../assets/kindergalactic-logo.svg?react"

export default function Logo(props) {
  useEffect(() => {
    const id = "logo-js";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "./js/logo.js";
      document.body.appendChild(script);
    }
  }, []);
  return <LogoSvg className={props.className} />
}