import { memo } from 'react'

import Box, { BoxProps } from '@mui/material/Box'

// ----------------------------------------------------------------------

function EmailIllustration({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="72"
      height="47"
      viewBox="0 0 72 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        color: 'background.paper',
        ...sx,
      }}
      {...other}
    >
      <g id="Group 3095">
        <path
          id="Vector 888"
          d="M46 34.0014C9.94944 60.5692 1 34.3566 1 34.3566"
          stroke="url(#paint0_linear_313_20599)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          id="Vector 850"
          d="M71.6345 0.644146L63.9166 36.9186C63.8705 37.135 63.6141 37.2288 63.4393 37.0932L52.5513 28.6474L45.5697 35.3235L41.4442 21.8363L28.5926 17.6521C28.325 17.565 28.3138 17.1907 28.5756 17.0876L71.2313 0.302551C71.4538 0.214985 71.6843 0.410244 71.6345 0.644146Z"
          fill="#F3F3F3"
        />
        <path
          id="Vector 852"
          d="M45.5705 35.295L46.8347 24.233C46.8356 24.2252 46.8447 24.2214 46.8508 24.2262L52.274 28.433C52.4188 28.5453 52.4299 28.7602 52.2974 28.8868L45.5874 35.3033C45.5806 35.3098 45.5695 35.3042 45.5705 35.295Z"
          fill="#93B6CC"
        />
        <path
          id="Vector 851"
          d="M61.9385 9.11596L41.6406 21.7147C41.5249 21.7865 41.4721 21.9271 41.5119 22.0573L45.5558 35.2777C45.559 35.2881 45.5741 35.2867 45.5753 35.2759L46.8268 24.3252C46.8348 24.255 46.8674 24.1899 46.9187 24.1414L62.3028 9.58879C62.5655 9.34038 62.2456 8.92533 61.9385 9.11596Z"
          fill="#B4CCE1"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_313_20599"
          x1="45.1411"
          y1="37.0401"
          x2="1"
          y2="33.1925"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#93B6CC" />
          <stop offset="1" stopColor="#99BBDA" stopOpacity="0" />
        </linearGradient>
      </defs>
    </Box>
  )
}

export default memo(EmailIllustration)
