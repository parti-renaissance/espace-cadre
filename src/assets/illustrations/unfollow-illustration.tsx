import { memo } from 'react'

import Box, { BoxProps } from '@mui/material/Box'

// ----------------------------------------------------------------------

function UnfollowIllustration({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="36"
      height="42"
      viewBox="0 0 36 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        color: 'background.paper',
        ...sx,
      }}
      {...other}
    >
      <path
        d="M36 27.6995C35.9996 18.1473 29.3744 6.82239 21.1021 2.04598C17.1368 -0.243585 13.5315 -0.546069 10.8522 0.811703L5.17258 4.37767C2.52688 5.96922 0.895818 9.29858 0.895996 14.0097C0.896357 23.5619 7.60265 35.1776 15.8749 39.954C20.2637 42.4881 24.2115 42.588 26.9508 40.6969L32.4593 36.8235C34.6682 35.0857 36.0001 31.9568 36 27.6995Z"
        fill="url(#paint0_linear_369_110379)"
      />
      <path
        d="M15.8749 39.954C7.60265 35.1776 0.896357 23.5619 0.895996 14.0097C0.895635 4.45752 7.60134 0.585972 15.8736 5.36239C24.1459 10.1388 30.8522 21.7544 30.8525 31.3066C30.8529 40.8588 24.1472 44.7304 15.8749 39.954Z"
        fill="#EEEFF6"
      />
      <path
        d="M22.8676 20.7139C23.5151 20.3495 23.5216 19.1487 22.8822 18.0319C22.2428 16.9151 21.1996 16.3051 20.5522 16.6695L15.3079 19.6213L10.0633 10.6133C9.41577 9.50114 8.37258 8.90641 7.73325 9.2849C7.09392 9.6634 7.10055 10.8718 7.74806 11.9839L12.9631 20.9412L7.74851 23.8763C7.10105 24.2407 7.09452 25.4415 7.7339 26.5583C8.37329 27.6752 9.41648 28.2851 10.0639 27.9207L15.3081 24.9689L20.5528 33.977C21.2003 35.0891 22.2435 35.6839 22.8829 35.3054C23.5222 34.9269 23.5156 33.7185 22.8681 32.6064L17.653 23.6491L22.8676 20.7139Z"
        fill="#EE3E6F"
      />
      <path
        d="M22.8676 20.7139C23.5151 20.3495 23.5216 19.1487 22.8822 18.0319C22.2428 16.9151 21.1996 16.3051 20.5522 16.6695L15.3079 19.6213L10.0633 10.6133C9.41577 9.50114 8.37258 8.90641 7.73325 9.2849C7.09392 9.6634 7.10055 10.8718 7.74806 11.9839L12.9631 20.9412L7.74851 23.8763C7.10105 24.2407 7.09452 25.4415 7.7339 26.5583C8.37329 27.6752 9.41648 28.2851 10.0639 27.9207L15.3081 24.9689L20.5528 33.977C21.2003 35.0891 22.2435 35.6839 22.8829 35.3054C23.5222 34.9269 23.5156 33.7185 22.8681 32.6064L17.653 23.6491L22.8676 20.7139Z"
        fill="url(#paint1_linear_369_110379)"
      />
      <path
        d="M22.8676 20.7139C23.5151 20.3495 23.5216 19.1487 22.8822 18.0319C22.2428 16.9151 21.1996 16.3051 20.5522 16.6695L15.3079 19.6213L10.0633 10.6133C9.41577 9.50114 8.37258 8.90641 7.73325 9.2849C7.09392 9.6634 7.10055 10.8718 7.74806 11.9839L12.9631 20.9412L7.74851 23.8763C7.10105 24.2407 7.09452 25.4415 7.7339 26.5583C8.37329 27.6752 9.41648 28.2851 10.0639 27.9207L15.3081 24.9689L20.5528 33.977C21.2003 35.0891 22.2435 35.6839 22.8829 35.3054C23.5222 34.9269 23.5156 33.7185 22.8681 32.6064L17.653 23.6491L22.8676 20.7139Z"
        fill="white"
        fillOpacity="0.23"
      />
      <defs>
        <linearGradient
          id="paint0_linear_369_110379"
          x1="18.448"
          y1="-3.67669e-07"
          x2="18.448"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EBE8FF" />
          <stop offset="0.893662" stopColor="#B3B0C6" />
          <stop offset="1" stopColor="#EBE8FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_369_110379"
          x1="1.50024"
          y1="20.4287"
          x2="24.9916"
          y2="19.9772"
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

export default memo(UnfollowIllustration)