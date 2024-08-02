import React from "react";

const News = () => {
  return (
    <div className="w-full h-14 z-10 bg-blue-200 overflow-hidden fixed mt-11">
      <div className="scroll-text flex whitespace-nowrap ">
        <marquee behavior="scroll" direction="right" className="flex">
          <span className="inline-block px-4 py-2 text-xl  text-blue-600 ">
            Dear Users, please pay attention to our latest activities to get
            more exclusive rewards,for more details please contact our customer
            service,thankyou for your support and trust in [WebFX]!
          </span>
          <span className="inline-block px-4 py-2 text-xl  text-blue-600 ">
            Dear Users, please pay attention to our latest activities to get
            more exclusive rewards,for more details please contact our customer
            service,thankyou for your support and trust in [WebFX]!
          </span>
        </marquee>
      </div>
    </div>
  );
};

export default News;
