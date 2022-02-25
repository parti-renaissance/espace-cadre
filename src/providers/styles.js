import { PoppinsFontFaces, MaaxFontFaces } from './fonts'

export const styles = {
  typography: {
    fontFamily: 'Poppins',
    pageTitle: {
      fontSize: '24px',
      fontWeight: '400',
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
      color: '#2834c3',
      background: {
        main: '#3743C814',
        hover: '#00000014',
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

    // White
    whiteCorner: '#FFFFFF',

    // Black
    blackCorner: '#1A334D',

    // Light blue
    lightBlue100: '#E0F2FE',
    lightBlue200: '#BAE6FD',
    lightBlue300: '#7DD3FC',
    lightBlue400: '#38BDF8',
    lightBlue500: '#0EA5E9',
    lightBlue600: '#0284C7',
    lightBlue700: '#0369A1',
    lightBlue800: '#075985',
    lightBlue900: '#0C4A6E',

    // Blue
    blueCorner: '#0049C6',
    blue2Corner: '#135CEB',
    blueCornerHover: '#1766ff',
    messagerieButtonHover: '#1f5bc2',
    blueBubble: '#D9EAFF',
    blue100: '#DBEAFE',
    blue200: '#BFDBFE',
    blue300: '#93C5FD',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',
    blue900: '#1E3A8A',

    // Indigo
    indigo100: '#E0E7FF',
    indigo200: '#C7D2FE',
    indigo300: '#A5B4FC',
    indigo400: '#818CF8',
    indigo500: '#6366F1',
    indigo600: '#4F46E5',
    indigo700: '#4338CA',
    indigo800: '#3730A3',
    indigo900: '#312E81',

    // Orange
    orange100: '#FFEDD5',
    orange200: '#FED7AA',
    orange300: '#FDBA74',
    orange400: '#FB923C',
    orange500: '#F97316',
    orange600: '#EA580C',
    orange700: '#C2410C',
    orange800: '#9A3412',
    orange900: '#7C2D12',

    // Gray
    grayCornerBg: '#F0F1F3',
    grayCorner3: '#717BA0',
    mentionsLegales: '#B0B6C9',
    interestsBubble: '#EFF1F3',
    gray50: '#F9FAFB',
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
    greenCorner: '#008000',
    successButton: '#28A745',

    green100: '#D1FAE5',
    green200: '#A7F3D0',
    green300: '#6EE7B7',
    green400: '#34D399',
    green500: '#10B981',
    green600: '#059669',
    green700: '#047857',
    green800: '#065F46',
    green900: '#064E3B',

    // Teal
    teal100: '#CCFBF1',
    teal200: '#99F6E4',
    teal300: '#5EEAD4',
    teal400: '#2DD4BF',
    teal500: '#14B8A6',
    teal600: '#0D9488',
    teal700: '#0F766E',
    teal800: '#115E59',
    teal900: '#134E4A',

    // Cyan
    cyan100: '#CFFAFE',
    cyan200: '#A5F3FC',
    cyan300: '#67E8F9',
    cyan400: '#22D3EE',
    cyan500: '#06B6D4',
    cyan600: '#0891B2',
    cyan700: '#0E7490',
    cyan800: '#155E75',
    cyan900: '#164E63',

    // Red
    statusError: '#DA1414',

    red100: '#FEE2E2',
    red200: '#FECACA',
    red300: '#FCA5A5',
    red400: '#F87171',
    red500: '#EF4444',
    red600: '#DC2626',
    red700: '#B91C1C',
    red800: '#991B1B',
    red900: '#7F1D1D',

    // Yellow
    yellow400: '#FBBF24',
    yellow500: '#F59E0B',

    // Riposte Colors
    riposteBackground: 'rgba(20, 184, 166, 0.08)',
    activeLabel: 'rgba(4, 120, 87, 0.08)',
    inactiveLabel: 'rgba(220, 38, 38, 0.08)',
    pastLabel: 'rgba(55, 65, 81, 0,08)',

    // News Colors
    newsBackground: '#FFF4ED',

    // Messages Colors
    messagesBackground: '#04785714',

    // Alert banner
    backgroundError: '#FEEFEF',
  },
  shape: {
    borderRadius: 8,
  },
}
