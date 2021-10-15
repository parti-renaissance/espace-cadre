import { createTheme } from '@material-ui/core';

const theme = createTheme({
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

        // Gray
        grayCornerBg: '#F0F1F3',
        grayCorner3: '#717BA0',
        mentionsLegales: '#B0B6C9',
        interestsBubble: '#EFF1F3',
        gray100: '#F3F4F6',
        gray200: '#E5E7EB',
        gray300: '#D1D5DB',
        gray400: '#9CA3AF',
        gray500: '#6B7280',
        gray600: '#4B5563',
        gray700: '#374151',
        gray800: '#1F2937',

        // Green
        greenCorner: '#008000',
        successButton: '#28A745',
        green700: '#047857',

        // Riposte Color
        riposteActionButton: 'rgba(20, 184, 166, 0.08)',
        teal700: '#0F766E',
        activeLabel: 'rgba(4, 120, 87, 0.08)',
        inactiveLabel: 'rgba(220, 38, 38, 0.08)',
        indigo700: '#4338CA',

        // Red
        statusError: '#DA1414',
        backgroundError: '#FEEFEF',
        red600: '#DC2626',
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
    props: {
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
});

export default theme;
