import React from "react";

const Box = ({ children, className = "" }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-1 bg-container rounded-lg print:rounded-none shadow-spread print:shadow-nonw border print:border-none ${className}`}
    >
      {children}
    </div>
  );
};

export default Box;