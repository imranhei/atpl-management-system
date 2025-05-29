import React from "react";

const Box = ({ children, className = "" }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-1 bg-container rounded shadow-spread border ${className}`}
    >
      {children}
    </div>
  );
};

export default Box;