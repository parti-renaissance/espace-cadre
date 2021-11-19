import { createTheme, adaptV4Theme } from '@mui/material'

const theme = createTheme(
  adaptV4Theme({
    typography: {
      fontFamily: 'Poppins, sans-serif',
      body2: {
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '14px',
        textTransform: 'none',
      },
    },
    props: {
      MuiTypography: {
        component: 'span',
      },
      MuiButton: {
        disableElevation: true,
      },
      MuiPaper: {
        elevation: 0,
      },
      MuiMenu: {
        elevation: 0,
      },
    },
    palette: {
      // White
      whiteCorner: '#fff',

      // Black
      blackCorner: '#1A334D',

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
      betaBubble: 'rgba(239, 68, 68, 0.1)',

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

      // Riposte Colors
      riposteBackground: 'rgba(20, 184, 166, 0.08)',
      activeLabel: 'rgba(4, 120, 87, 0.08)',
      inactiveLabel: 'rgba(220, 38, 38, 0.08)',

      // News Colors
      newsBackground: '#FFF4ED',

      // Teams Colors
      teamBackground: 'rgba(8, 145, 178, 0.08)',

      // Alert banner
      backgroundError: '#FEEFEF',
    },
  })
)

export default theme
