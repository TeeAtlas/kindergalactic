import React from "react"
import WaitlistButton from "../components/WaitlistButton"


export default function Hero() {
   return (
     <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-white px-4">
      <img
        src="./images/logo-green-cat-eyes-01.png"
        alt="Kindergalactic green cat logo"
        className="max-h-72 sm:max-h-48 md:max-h-72 lg:max-h-150 w-auto object-contain"
      />
      <div className="mt-1 mb- flex flex-col items-center gap-3">
     <p className="max-w-[100%] text-center text-gray-700 text-sm md:text-base leading-snug">
  Kidswear for kids (and grownups)
</p>
<WaitlistButton />
</div>
</div>

   )
}