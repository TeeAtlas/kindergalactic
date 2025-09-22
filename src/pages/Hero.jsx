import React from "react"
import Logo from "../components/Logo"
import WaitlistButton from "../components/WaitlistButton"

export default function Hero() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center px-4">
      <Logo className="max-h-72 sm:max-h-48 md:max-h-72 lg:max-h-150 w-auto object-contain" id="kindergalactic-logo" />
      <div className="mt-1 mb- flex flex-col items-center gap-3">
        <p className="max-w-[100%] text-center text-gray-700 text-sm md:text-base leading-snug">Streetwear for kids (and parents)</p>
        <WaitlistButton />
      </div>
    </div>
  )
}