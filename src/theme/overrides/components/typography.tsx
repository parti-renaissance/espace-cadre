import { Theme } from '@mui/material/styles';
import { PoppinsFontFaces, MaaxFontFaces } from '../../../providers/fonts'

// ----------------------------------------------------------------------

export function typography(theme: Theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        root: [PoppinsFontFaces, MaaxFontFaces],
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
}
