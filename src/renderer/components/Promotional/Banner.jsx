import React from "react";
import { constant } from "./constant";
import bannerimg from "../../../main/helpers/assets/promote.svg";
function Banner({ composeopen, setcomposeopen }) {
  const { title, tagline, description, PromotebtnText } = constant.Banner[0];
  return (
    <aside className="relative overflow-hidden   rounded-xl lg:flex max-w-screen-xl px-4 shadow-2xl mx-auto ">
      <div className="w-full p-12 text-center lg:w-1/2 sm:p-16 lg:p-24 lg:text-left">
        <div className="max-w-xl mx-auto lg:ml-0">
          <p className="text-sm font-medium">{title}</p>

          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {tagline}
          </p>

          <p className="hidden lg:mt-4 lg:block">{description}</p>

          <button
            href=""
            onClick={() => setcomposeopen(!composeopen)}
            className="inline-block px-5 py-3 mt-8 text-sm font-medium  bg-gradient-to-tl from-primary-background to-primary rounded-tl-2xl rounded-br-2xl  shadow-lg "
          >
            {PromotebtnText}
          </button>
        </div>
      </div>
      <div className="relative w-full h-64  lg:w-1/2 lg:h-auto">
        <img
          src={bannerimg}
          alt="lucamail promotional banner"
          className="absolute inset-0 object-contain w-full h-full"
        />
      </div>
    </aside>
  );
}

export default Banner;
