import { useEffect } from "react";

export default function WaitlistButton() {
  useEffect(() => {
    const id = "tally-js";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://tally.so/widgets/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
 <button
  type="button"
  data-tally-open="woJJ9N"
  data-tally-auto-close="3000"
  className="rounded-lg border border-orange-500 px-4 py-1.5 text-sm md:px-6 md:py-2 md:text-base text-gray-700 transition hover:bg-gray-300 active:bg-gray-300 active:scale-95 cursor-pointer"
>
  Join the Waitlist
</button>

  );
}