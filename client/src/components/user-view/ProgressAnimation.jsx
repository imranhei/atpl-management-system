import React from "react";

const ProgressAnimation = ({ value, aamplitude }) => {
  function generateWave(cycles, amplitude) {
    const height = 100; // was width before
    const cycleHeight = height / cycles;

    let path = `M${100 - amplitude} 0 `; // start on left side, bottom of wave

    for (let i = 0; i < cycles; i++) {
      const y1 = i * cycleHeight + cycleHeight * 0.33;
      const y2 = i * cycleHeight + cycleHeight * 0.66;
      path += `C 100 ${y1}, ${100 - amplitude * 2} ${y2}, ${100 - amplitude} ${
        (i + 1) * cycleHeight
      } `;
    }

    path += `L 0 100 L 0 0 Z`;
    return path;
  }

  return (
    <div className="relative w-full h-full overflow-hidden dark:opacity-75">
      <div
        className="absolute w-full h-[300%] animate-wave -mt-2 ml-1"
        style={{
          left: `${value - 3}%`,
          transition: "top 0.5s ease-out",
        }}
      >
        <svg
          viewBox="0 0 1350 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path d={generateWave(2, aamplitude)} fill="#9cfadc" />
        </svg>
        <div className="w-full h-full bg-[#9cfadc] absolute top-0 -left-[100%]"></div>
      </div>
      <div
        className="absolute w-full h-[300%] animate-wave"
        style={{
          left: `${value - 3}%`,
          transition: "top 0.5s ease-out",
        }}
      >
        <svg
          viewBox="0 0 1350 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path d={generateWave(2, aamplitude)} fill="#26f7b5" />
        </svg>
        <div className="w-full h-full bg-[#26f7b5] absolute top-0 -left-[100%]"></div>
      </div>
    </div>
  );
};

export default ProgressAnimation;
