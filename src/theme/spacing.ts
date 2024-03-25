const base = 2

export const MuiSpacing = {
  smaller: base / 4,
  small: base / 2,
  normal: base,
  large: base * 2,
  larger: base * 4,
}

export const withBottomSpacing = {
  mb: MuiSpacing.normal,
}

export const gridStandardLayout = {
  oneThird: {
    xs: 12,
    sm: 12,
    md: 4,
  },
  twoThirds: {
    xs: 12,
    sm: 12,
    md: 8,
  },
}