import { memo } from 'react'

import Box, { BoxProps } from '@mui/material/Box'

// ----------------------------------------------------------------------

function NewletterIcons({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="34px"
      height="34px"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <g id="Group 3520">
        <path
          id="Rectangle 2202"
          d="M1.58334 13.4286V1.58334H32.4167V13.4286V32.4167H1.58334V13.4286Z"
          stroke="black"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path id="Rectangle 2204" d="M12.8333 7.83334H26.1667" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse id="Ellipse 290" cx="7" cy="7.83335" rx="1.66667" ry="1.66667" fill="black" />
      </g>
    </Box>
  )
}

export default memo(NewletterIcons)
