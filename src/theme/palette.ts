import { alpha } from '@mui/material/styles'

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string
  }
  interface SimplePaletteColorOptions {
    lighter: string
    darker: string
  }
  interface PaletteColor {
    lighter: string
    darker: string
  }
}

// SETUP COLORS

export const grey = {
  100: '#f9fafbff',
  200: '#f4f6f8ff',
  300: '#dfe3e8ff',
  400: '#c4cdd5ff',
  500: '#919eabff',
  600: '#637381ff',
  700: '#454f5bff',
  800: '#212b36ff',
  900: '#161c24ff',
}

export const warning = {
  main: '#ffc905ff',
  light: '#ffd642ff',
  lighter: '#fff0c2ff',
  darker: '#755610ff',
  dark: '#a47904ff',
  contrastText: '#000',
}

export const error = {
  lighter: '#ffe0d6ff',
  light: '#ff8d70ff',
  main: '#ff4b2bff',
  dark: '#c40e08ff',
  darker: '#7e1410ff',
  contrastText: '#ffffffff',
}

export const primary = {
  lighter: '#c2ceffff',
  light: '#9eb1ffff',
  main: '#667affff',
  dark: '#292fa8ff',
  darker: '#181c4eff',
  contrastText: '#ffffffff',
}

export const secondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
}

export const success = {
  lighter: '#e3f7e1ff',
  light: '#98e094ff',
  main: '#42b73cff',
  dark: '#267023ff',
  darker: '#1d491dff',
  contrastText: '#ffffffff',
}

export const info = {
  lighter: '#d6e2ffff',
  light: '#85c4ffff',
  main: '#0084ffff',
  dark: '#0d6a9cff',
  darker: '#0e445dff',
  contrastText: '#ffffffff',
}

export const other = {
  Facebook: '#1877f2ff',
  Twitter: '#00aaecff',
  Linkedin: '#007ebbff',
  Instagram: '#e02d69ff',
  Skin: '#fdbab9ff',
  Mask: '#ffffff00',
}

export const common = {
  black: '#000000',
  white: '#FFFFFF',
}

export const tagsColor = {
  unknownText: '#637381',
  unknownBackground: '#EDEFF2',
  variant1Text: '#0274B1',
  variant1Background: '#D6EBFF',
  variant2Text: '#8B5311',
  variant2Background: '#FFF0DE',
  variant3Text: '#762BD8',
  variant3Background: '#EEE2FF',
}

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
}

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
  main: '#1254D8',
  button: {
    color: {
      main: '#1254D8',
      disabled: '#6B7280',
    },
    background: {
      main: '#1254D8',
      disabled: '#E5E7EB',
      hover: 'rgba(55, 67, 200, 0.08)',
    },
  },
  menu: {
    color: {
      main: '#FFFFFF',
      active: '#0B3282',
    },
    background: {
      main: '#0B3282',
      hover: '#FFFFFF14',
      active: '#FFFFFF',
    },
  },
  form: {
    label: {
      color: '#413D45',
    },
    input: {
      background: '#F3F4F6',
      borderColor: {
        focus: '#1254D8',
      },
    },
    error: {
      background: '#FEEFEF',
      color: '#DA1414',
    },
    success: {
      background: '#EDF9F0',
      color: '#287D3C',
    },
    warning: {
      background: '#FFF4EC',
      color: '#B95000',
    },
    info: {
      background: '#EEF2FA',
      color: '#2E5AAC',
    },
  },
  notification: {
    success: {
      background: '#287D3C',
    },
    error: {
      background: '#DA1414',
    },
    info: {
      background: '#1254D8',
    },
  },
  emptyContent: {
    description: '#1F2937',
  },
  campaign: {
    background: {
      title: {
        main: '#F0EFFB',
        hover: '#F0EFFB',
      },
      chip: {
        default: 'rgba(55, 65, 81, 0.08)',
        sent: 'rgba(3, 105, 161, 0.08)',
        unsubscribed: 'rgba(245, 158, 11, 0.08)',
        completed: 'rgba(4, 120, 87, 0.08)',
        ongoing: 'rgba(4, 120, 87, 0.08)',
      },
      progressBar: {
        empty: 'rgba(67, 56, 202, 0.16)',
      },
      ratio: {
        max: 'rgba(85, 113, 141, 0.25)',
      },
      table: {
        cell: {
          even: '#FFFFFF',
          odd: '#F9FAFB',
          border: '#E5E7EB',
        },
      },
    },
    button: {
      background: {
        main: '#1254D8',
        prev: '#FFFFFF',
        next: '#1254D8',
        disabled: '#E5E7EB',
      },
      color: {
        main: '#FFFFFF',
        prev: '#1254D8',
        next: '#FFFFFF',
        disabled: '#6B7280',
      },
    },
  },
  stepper: {
    stepTitle: {
      color: '#1F2937',
    },
  },
  signupButton: {
    color: '#3743C814',
    background: {
      main: '#1254D8',
      hover: '#1254D8',
    },
  },
  events: {
    chip: {
      background: 'rgba(55, 65, 81, 0.08)',
      color: '#374151',
    },
  },
  news: {
    button: {
      main: {
        background: '#1254D8',
        color: '#FFFFFF',
      },
      outlined: {
        primary: '#1254D8',
        secondary: '#CC0613',
      },
    },
  },
  colors: {
    blue: {
      50: '#F3F6FD',
      100: '#D2DFFB',
      200: '#A2BEF7',
      300: '#5D8EF1',
      400: '#2E6EEE',
      500: '#1254D8',
      600: '#104CC2',
      700: '#0E3FA2',
      800: '#0B3282',
      900: '#09296A',
    },
    green: {
      50: '#EAF6F4',
      100: '#D7F4EE',
      200: '#C2EEE5',
      300: '#ACE8DC',
      400: '#60CBB6',
      500: '#2EA78F',
      600: '#299681',
      700: '#237D6B',
      800: '#1C6456',
      900: '#175246',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    pink: '#f472b6',
    white: '#FFF',
  },

  // White
  whiteCorner: '#FFFFFF',

  // Black
  blackCorner: '#1A334D',
  neutralBlack: '#09101D',
  black800: 'rgba(0,0,0,0.8)',

  // Light blue
  lightBlue600: '#0284C7',
  lightBlue700: '#0369A1',

  // Blue
  blueCorner: '#1254D8',
  blue2Corner: '#135CEB',
  blueNewsAlert: 'rgba(40, 52, 196, 0.08)',
  blueBubble: '#D9EAFF',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue800: '#1E40AF',

  // Indigo
  indigo700: '#104CC2',

  // Orange
  orange500: '#F97316',

  // Gray
  grayCornerBg: '#F0F1F3',
  grayCorner3: '#717BA0',
  mentionsLegales: '#B0B6C9',
  interestsBubble: '#EFF1F3',
  gray40: 'rgba(9, 16, 29, 0.04)',
  gray50: '#F9FAFB',
  gray80: 'rgba(9, 16, 29, 0.8)',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Green
  green600: '#059669',
  green700: '#047857',

  // Teal
  teal700: '#0F766E',

  // Cyan
  cyan700: '#0E7490',

  // Red
  statusError: '#DA1414',
  red600: '#DC2626',

  // Yellow
  yellow400: '#FBBF24',
  yellow500: '#F59E0B',
  yellow800: '#854d0e',

  // Riposte Colors
  activeLabel: 'rgba(4, 120, 87, 0.08)',
  inactiveLabel: 'rgba(220, 38, 38, 0.08)',
  pendingLabel: 'rgba(245, 158, 11, 0.08)',
  pastLabel: 'rgba(55, 65, 81, 0,08)',

  // Messages Colors
  messagesBackground: '#04785714',

  // Alert banner
  backgroundError: '#FEEFEF',

  // Tags color
  activist: '#C2E1FF',
}

// ----------------------------------------------------------------------

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...base,
    mode: 'light',
    text: {
      primary: '#212B36',
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  }

  const dark = {
    ...base,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: '#637381',
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
      neutral: alpha(grey[500], 0.12),
    },
    action: {
      ...base.action,
      active: grey[500],
    },
  }

  return mode === 'light' ? light : dark
}
