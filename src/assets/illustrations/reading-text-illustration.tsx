import { memo } from 'react'

import Box, { BoxProps } from '@mui/material/Box'

// ----------------------------------------------------------------------

function ReadingTextIllustration({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="36"
      height="48"
      viewBox="0 0 36 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        color: 'background.paper',
        ...sx,
      }}
      {...other}
    >
      <g id="Group 3417">
        <g id="Group 3153">
          <path
            id="Union"
            d="M28.1426 0.328465L7.17574 13.0909C3.18601 15.5194 0.750977 19.8523 0.750977 24.523V39.913C0.750977 40.9573 1.43873 41.7638 2.31238 42.0419L6.32741 43.9916L8.59879 42.0419L10.1194 45.2983L14.7977 47.7804C14.8005 47.7819 14.8039 47.7801 14.8043 47.777L15.6958 39.0843L32.4251 27.2623L33.9865 20.7936L34.2096 2.27983L30.4622 0.328465C29.7913 -0.0792446 28.9111 -0.139354 28.1426 0.328465Z"
            fill="url(#paint0_linear_313_20609)"
          />
          <path
            id="Union_2"
            d="M32.604 2.55967L11.6372 15.3221C7.64743 17.7506 5.2124 22.0835 5.2124 26.7542V42.1442C5.2124 43.8595 7.06776 44.9329 8.55481 44.0779L12.0348 42.0771L14.7993 47.9975C14.801 48.0011 14.8062 48.0009 14.8076 47.9971L18.1497 38.8619L29.4966 32.0537C33.5278 29.635 35.9943 25.2786 35.9943 20.5775V4.46502C35.9943 2.72486 34.0904 1.65487 32.604 2.55967Z"
            fill="#F3F3F3"
          />
          <g id="Union_3">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.292 23.7647L32.6983 10.0278V10.8034L10.292 24.5402V23.7647ZM10.292 29.6052L32.6983 15.8684V16.644L10.292 30.3808V29.6052ZM32.6983 21.1582L10.292 34.8951V35.6706L32.6983 21.9338V21.1582Z"
              fill="#809FEC"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.292 23.7647L32.6983 10.0278V10.8034L10.292 24.5402V23.7647ZM10.292 29.6052L32.6983 15.8684V16.644L10.292 30.3808V29.6052ZM32.6983 21.1582L10.292 34.8951V35.6706L32.6983 21.9338V21.1582Z"
              fill="url(#paint1_linear_313_20609)"
            />
          </g>
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_313_20609"
          x1="17.4803"
          y1="-0.000244141"
          x2="17.4803"
          y2="47.781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EBE8FF" />
          <stop offset="0.893662" stopColor="#B3B0C6" />
          <stop offset="1" stopColor="#EBE8FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_313_20609"
          x1="8.50379"
          y1="21.0259"
          x2="22.0653"
          y2="21.1223"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.225" stopColor="#6E8EDD" />
          <stop offset="0.5" stopColor="#4B6CBE" />
          <stop offset="0.775" stopColor="#809FEC" />
        </linearGradient>
      </defs>
    </Box>
  )
}

export default memo(ReadingTextIllustration)
