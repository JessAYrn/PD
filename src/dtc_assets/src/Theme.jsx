import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#0A0A0A',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: '#343434',
      },
      // Provide every color token (light, main, dark, and contrastText) when using
      // custom colors for props in Material UI's components.
      // Then you will be able to use it like this: `<Button color="custom">`
      // (For TypeScript, you need to add module augmentation for the `custom` value)
      custom: {
        main: '#F7931A',
      },
      white: {
        main: grey[100],
        light: grey[50],
        dark: grey[500]
      },
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
    components: {
      MuiTextField:{
        styleOverrides: {
          root:{
            backgroundColor: grey[900],
            opacity: 0.825,
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#F7931A' ,
            "&.Mui-disabled": {
              color: '#F7931A'
            },
            "&.Mui-focused": {
              color: grey[100]
            }
          }
        }
      },
      MuiInputBase: {
        styleOverrides:{
          root:{
            "&.Mui-disabled": {
              color: grey[50],
              "-webkit-text-fill-color": grey[100]
            }
          },
          input:{
            "&.Mui-disabled": {
              color: grey[50],
              "-webkit-text-fill-color": grey[100]
            }
          }
        }
      },
      MuiFilledInput: {
        styleOverrides:{
          root:{
            color: grey[50],
            "&.Mui-disabled": {
              color: grey[50],
              "-webkit-text-fill-color": grey[100]
            }
          }
        }
      },
    },
});

export default theme;