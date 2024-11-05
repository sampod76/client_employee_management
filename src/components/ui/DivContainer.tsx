import React from 'react';

export default function DivContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <div className="relative w-full rounded-3xl shadow-2xl ring-2 ring-pink-300">
          <div className="absolute -inset-5 w-full">
            <div className="mx-auto h-full w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600 opacity-5 blur-lg lg:mx-0"></div>
          </div>
          <div
            title=""
            className="font-pj relative z-10 inline-flex w-full items-center justify-center rounded-3xl border-2 border-transparent px-8 py-3 text-lg font-bold text-white transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto"
            role="button"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
