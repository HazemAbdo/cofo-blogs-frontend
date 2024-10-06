import React, { LegacyRef } from "react";
function Spinner({ myRef }: { myRef?: LegacyRef<SVGSVGElement> | undefined }) {
  return (
    <svg
      id='cofo-spinner'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 512 512'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      fillOpacity={0}
      fill='fff'
      className='w-96 h-96 m-auto bg-transparent'
      ref={myRef}
    >
      <style>
        {`
          @keyframes animate-dash {
            0% {
              stroke-dasharray: 380;
              stroke: #1d1d1d;
            }
            50% {
              stroke-dasharray: 0;
              stroke: orange;
            }
            100% {
              stroke-dasharray: 380;
              stroke: #1d1d1d;
            }
          }

          #cofo-spinner path {
            animation: animate-dash 4s infinite ease-in-out;
            stroke: #fff;
          }
        `}
      </style>
      <path
        d='M93.5,39.4c-2-3.5-4.9-6.4-8.4-8.4v0c-7.4-4.1-16.4-4.1-23.8,0-3.5,2-6.4,4.9-8.4,8.4-2,3.6-3.1,7.7-3,11.8v0c0,3.5-.8,7-2.5,10.1-1.6,3-4.1,5.4-7,7.1-6.2,3.4-13.7,3.4-19.9,0-2.9-1.7-5.4-4.2-7-7.1-3.5-6.4-3.5-14-.1-20.3c5.5-9.4,17.5-12.6,26.9-7.2l.4.3c.9.5,2,.1,2.5-.8s.1-2-.8-2.5c0,0,0,0,0,0l-.2-.1v0c-7.4-4.1-16.4-4.1-23.8,0-3.5,2-6.4,4.9-8.4,8.4-2,3.6-3.1,7.8-3,12c0,4.2,1,8.2,3,11.9c2,3.5,4.9,6.4,8.4,8.4c7.4,4.1,16.4,4.1,23.8,0c3.5-2,6.4-4.9,8.4-8.4.4-.7.8-1.4,1.1-2.2.3.8.7,1.6,1.2,2.4c2,3.5,4.9,6.4,8.4,8.4c7.4,4.1,16.4,4.1,23.8,0c3.5-2,6.4-4.9,8.4-8.4c2-3.6,3.1-7.7,3-11.9.1-4.1-.9-8.3-3-11.9Zm-3.4,22c-1.6,3-4.1,5.4-7,7.1-6.2,3.4-13.7,3.4-19.9,0-2.9-1.7-5.4-4.2-7-7.1-3.4-6.3-3.4-13.9,0-20.3c5.5-9.4,17.5-12.6,27-7.2c2.9,1.7,5.3,4.2,7,7.2c3.3,6.4,3.3,14-.1,20.3v0Z'
        transform='matrix(4.136294 0 0 4.136294 42.945616 44.428572)'
        paintOrder='stroke fill markers'
        fill='rgba(255,255,255,0)'
        stroke='#000'
        strokeDasharray='380'
      />
    </svg>
  );
}
export default Spinner;
