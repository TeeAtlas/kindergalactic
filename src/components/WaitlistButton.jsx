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
  className="rounded-lg px-4 py-1.5 text-sm md:px-6 md:py-2 md:text-base text-white text-shadow-sm tracking-wide transition hover:bg-green-700 bg-orange-400"
>
  Join the Waitlist
</button>

  );
}