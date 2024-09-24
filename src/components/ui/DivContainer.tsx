import React from "react";

export default function DivContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-center items-center w-full">
        <div className="relative shadow-2xl w-full rounded-3xl ring-2 ring-pink-300">
          <div className="absolute -inset-5 w-full">
            <div className="w-full h-full  mx-auto lg:mx-0 opacity-5 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600"></div>
          </div>
          <div
            title=""
            className="relative   z-10 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200  border-2 border-transparent sm:w-auto rounded-3xl font-pj hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            role="button"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
