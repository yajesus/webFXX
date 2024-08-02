import React from "react";

const News = () => {
  return (
    <div className="w-full h-14 z-10 bg-slate-500 overflow-hidden fixed mt-11">
      <div className="scroll-text whitespace-nowrap">
        <span className="inline-block px-4 py-2 text-xl font-bold">
          This is a scrolling text effect!
        </span>
        <span className="inline-block px-4 py-2 text-xl font-bold">
          This is a scrolling text effect!
        </span>
      </div>
    </div>
  );
};

export default News;
