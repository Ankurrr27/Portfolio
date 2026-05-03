import React from 'react';

const PhoneComponent = () => {
  return (
    <div
      className="group relative flex justify-center h-[350px] w-[180px] border-[3px] border-gray-800 rounded-[32px] bg-gray-900 shadow-xl ring-1 ring-gray-900/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 select-none"
    >
      <div
        className="absolute inset-0 rounded-[30px] border border-white/10 pointer-events-none"
      ></div>

      <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-black">
        <div
          className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-amber-950/20 to-zinc-950 transition-transform duration-700 group-hover:scale-110"
        ></div>
        <div
          className="absolute top-0 right-0 w-[150px] h-[150px] bg-amber-600/20 blur-[40px] rounded-full mix-blend-screen transition-all duration-700 group-hover:translate-x-4 group-hover:-translate-y-4"
        ></div>
        <div
          className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-amber-600/20 blur-[40px] rounded-full mix-blend-screen transition-all duration-700 group-hover:-translate-x-4 group-hover:translate-y-4"
        ></div>

        <div
          className="absolute top-1 w-full px-4 py-1 flex justify-between items-center z-10 text-white text-[8px] font-medium opacity-80"
        >
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-2.5 h-2.5"
            >
              <path d="M3 20h18V2L3 20z"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M3 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25zm17.5 4.5a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-1.5v-4.5h1.5z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center pt-12 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-y-4 group-hover:scale-95 group-hover:pointer-events-none z-10"
        >
          <div className="flex flex-col items-center text-white/90">
            <span className="text-[8px] font-semibold tracking-wider"
              >TUESDAY, 10 DEC</span
            >
            <span className="text-6xl font-thin tracking-tighter -mt-2">09:41</span>
          </div>

          <div className="absolute bottom-6 w-full px-6 flex justify-between">
            <div
              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21"
                ></path>
              </svg>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                ></path>
              </svg>
            </div>
          </div>

          <div
            className="absolute bottom-2 w-[40%] h-[3px] bg-white/50 rounded-full"
          ></div>
        </div>

        <div
          className="absolute inset-0 pt-10 pb-4 px-3 flex flex-col justify-between opacity-0 scale-105 translate-y-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 z-0"
        >
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 place-items-center mt-2">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div
                className="w-9 h-9 rounded-xl bg-amber-500 shadow-md shadow-amber-500/20 flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    d="M6.25 5.5a3.25 3.25 0 016.326-1.026 5.5 5.5 0 011.666 10.463 3.75 3.75 0 11-2.956-6.84 2.25 2.25 0 10-4.665-.333A4.002 4.002 0 004 14a4 4 0 012.25-7.5z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div
                className="w-9 h-9 rounded-xl bg-white shadow-md flex flex-col items-center justify-center text-red-500"
              >
                <span className="text-[5px] font-bold uppercase leading-none mt-1"
                  >Tue</span
                ><span className="text-sm font-light leading-none text-black">10</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-300 via-pink-500 to-purple-500 shadow-md flex items-center justify-center overflow-hidden"
              >
                <div className="w-4 h-4 rounded-full bg-white/40 blur-[2px]"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div
                className="w-9 h-9 rounded-xl bg-neutral-200 shadow-md flex items-center justify-center text-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div
            className="w-full h-14 bg-white/20 backdrop-blur-xl border border-white/10 rounded-[20px] flex items-center justify-evenly px-2 mb-2 shadow-lg"
          >
            <div
              className="w-10 h-10 rounded-xl bg-green-500 shadow-md shadow-green-500/20 flex items-center justify-center text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-green-400 shadow-md shadow-green-400/20 flex items-center justify-center text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-amber-500 shadow-md shadow-amber-500/20 flex items-center justify-center text-white border border-amber-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 right-0 w-[120%] h-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -skew-x-12 translate-x-[20%] pointer-events-none group-hover:translate-x-[-100%] transition-transform duration-1000 ease-in-out"
      ></div>

      <div
        className="group/notch absolute top-[10px] z-30 h-5 w-16 rounded-full bg-black transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] hover:w-[150px] hover:h-12 hover:rounded-[18px] flex items-center justify-between px-2 overflow-hidden cursor-pointer shadow-lg border border-white/5"
      >
        <div
          className="opacity-0 group-hover/notch:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-2 w-full text-white text-[8px]"
        >
          <div
            className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-inner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="flex flex-col leading-tight whitespace-nowrap">
            <span className="font-semibold text-[9px]">Playing Music</span>
            <span className="text-gray-400 text-[8px]">Artist Name</span>
          </div>
          <div className="flex items-end gap-[1.5px] h-3 ml-auto pr-1">
            <div
              className="w-[2px] bg-green-400 h-full animate-[bounce_1s_infinite]"
            ></div>
            <div
              className="w-[2px] bg-green-400 h-2/3 animate-[bounce_1.2s_infinite]"
            ></div>
            <div
              className="w-[2px] bg-green-400 h-1/2 animate-[bounce_0.8s_infinite]"
            ></div>
          </div>
        </div>
      </div>

      <span
        className="absolute -right-[4px] top-16 h-10 w-[3px] rounded-r-md bg-gray-700 shadow-sm border-l border-gray-900"
      ></span>
      <span
        className="absolute -left-[4px] top-12 h-6 w-[3px] rounded-l-md bg-gray-700 shadow-sm border-r border-gray-900"
      ></span>
      <span
        className="absolute -left-[4px] top-20 h-10 w-[3px] rounded-l-md bg-gray-700 shadow-sm border-r border-gray-900"
      ></span>
      <span
        className="absolute -left-[4px] top-32 h-10 w-[3px] rounded-l-md bg-gray-700 shadow-sm border-r border-gray-900"
      ></span>
    </div>
  );
};

export default PhoneComponent;
