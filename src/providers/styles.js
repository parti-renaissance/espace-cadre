import { PoppinsFontFaces, MaaxFontFaces } from './fonts'

export const styles = {
  typography: {
    fontFamily: 'Poppins',
    pageTitle: {
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: '36px',
      color: 'gray800',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '14px',
      textTransform: 'none',
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      textTransform: 'none',
    },
    subtitle2: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '18px',
      textTransform: 'none',
    },
    button: {
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: '22px',
      letterSpacing: '0.46px',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        component: 'span',
      },
      styleOverrides: {
        root: [PoppinsFontFaces, MaaxFontFaces],
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          padding: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          color: '#1A334D',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'unset',
          },
        },
      },
    },
    MuiYearPicker: {
      styleOverrides: {
        root: {
          button: {
            '&.Mui-selected': {
              backgroundColor: '#000000',
              color: '#FFFFFF',
              '&:hover, &:focus': {
                backgroundColor: '#000000',
                color: '#FFFFFF',
              },
            },
          },
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
  palette: {
    main: '#2834C3',
    button: {
      color: {
        main: '#2834c3',
        disabled: '#6B7280',
      },
      background: {
        main: '#2834c3',
        disabled: '#E5E7EB',
        hover: 'rgba(55, 67, 200, 0.08)',
      },
    },
    menu: {
      color: {
        main: '#FFFFFF',
        active: '#1D214F',
      },
      background: {
        main: '#1D214F',
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
          focus: '#2834c3',
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
        background: '#2834C3',
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
          main: '#2834C3',
          prev: '#FFFFFF',
          next: '#2834C3',
          disabled: '#E5E7EB',
        },
        color: {
          main: '#FFFFFF',
          prev: '#2834C3',
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
        main: '#2834C3',
        hover: '#2834C3',
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
          background: '#2834C3',
          color: '#FFFFFF',
        },
        outlined: {
          primary: '#2834C3',
          secondary: '#CC0613',
        },
      },
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
    blueCorner: '#0049C6',
    blue2Corner: '#135CEB',
    blueNewsAlert: 'rgba(40, 52, 196, 0.08)',
    blueBubble: '#D9EAFF',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',

    // Indigo
    indigo700: '#4338CA',

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

    // Riposte Colors
    activeLabel: 'rgba(4, 120, 87, 0.08)',
    inactiveLabel: 'rgba(220, 38, 38, 0.08)',
    pastLabel: 'rgba(55, 65, 81, 0,08)',

    // Messages Colors
    messagesBackground: '#04785714',

    // Alert banner
    backgroundError: '#FEEFEF',
  },
}
