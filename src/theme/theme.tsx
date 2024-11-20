import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: "#1275B8",
            color: "#FCFEFD",
            fontWeight: "bold",
          },
        },
      ],
    },
  },
});
