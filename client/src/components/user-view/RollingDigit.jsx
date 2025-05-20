import { useEffect, useRef, useState } from "react";

const RollingDigit = ({ digit }) => {
  const ref = useRef(null);
  const [prevDigit, setPrevDigit] = useState(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // For non-numeric digit just do nothing
    if (isNaN(digit)) {
      el.style.transform = "translateY(0)";
      setPrevDigit(digit);
      return;
    }

    const currentIndex = Number(digit);

    if (prevDigit === null) {
      // Initial setup without transition
      el.style.transition = "none";
      el.style.transform = `translateY(-${currentIndex * 10}%)`;
      // Force reflow
      void el.offsetHeight;
      el.style.transition = "transform 0.4s ease-in-out";
    } else if (prevDigit !== digit) {
      // Animate to new position
      el.style.transform = `translateY(-${currentIndex * 10}%)`;
    }
    setPrevDigit(digit);
  }, [digit, prevDigit]);

  if (isNaN(digit)) {
    return (
      <span className="inline-block w-[0.6em] -translate-y-0.5 text-center text-white select-none">
        {digit}
      </span>
    );
  }

  return (
    <div className="h-[1em] w-[0.6em] overflow-hidden relative select-none">
      <div ref={ref} className="absolute top-0 left-0 flex flex-col">
        {[...Array(10).keys()].map((n) => (
          <div
            key={n}
            className="h-[1em] text-sm flex items-center justify-center text-white chakra-petch-medium"
            style={{ lineHeight: "1em" }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RollingDigit;
