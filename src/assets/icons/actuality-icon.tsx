import { memo } from 'react'

import Box, { BoxProps } from '@mui/material/Box'

// ----------------------------------------------------------------------

function ActualityIcons({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="32px"
      height="33px"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <g id="Group 3543">
        <path
          id="Vector 950"
          d="M1.41667 30.3333C1.41667 31.0237 1.97632 31.5833 2.66667 31.5833H29.3333C30.0237 31.5833 30.5833 31.0237 30.5833 30.3333V10.3333C30.5833 9.82246 30.2724 9.363 29.7982 9.173C29.324 8.98301 28.7819 9.10072 28.4291 9.47028L16 22.4922L3.5709 9.47028C3.21816 9.10072 2.67603 8.98301 2.2018 9.173C1.72756 9.363 1.41667 9.82246 1.41667 10.3333V30.3333Z"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector 951"
          d="M27.6667 9.5L27.6667 2L4.33334 2L4.33334 9.5"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Box>
  )
}

export default memo(ActualityIcons)
