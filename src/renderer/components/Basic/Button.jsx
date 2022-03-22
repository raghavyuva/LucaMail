import React from "react";

function Button({ handler, btntext }) {
  return (
    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <button
        onClick={handler}
        className="inline-block px-5 py-3 mt-8 text-sm font-medium hover:bg-primary bg-primary rounded-tl-2xl rounded-br-2xl text-BannerCardButtonText shadow-lg "
      >
        {btntext}
      </button>
    </div>
  );
}

export default Button;
