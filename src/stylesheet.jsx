import { createTheme } from '@material-ui/core';

export const colorPalette = {
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
};

export const typography = {
    fontFamily: 'Poppins',
};

export const theme = createTheme({
    colorPalette,
    typography,
});
