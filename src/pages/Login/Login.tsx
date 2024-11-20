import { Button, CircularProgress, IconButton, Snackbar, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { authenticateUser } from "../../service/api-service";
import { authProvider } from "../../contexts/authProvider";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function Login() {
  const navigate = useNavigate()

  const [formState, setFormState] = useState<{ key: string, isLoading: boolean, showErrorMessage: boolean, errorMessage: string, shouldShowPasswordType: boolean }>({
    errorMessage: "",
    isLoading: false,
    key: "",
    showErrorMessage: false,
    shouldShowPasswordType: true
  })

  const { login, user, sessionOpen } = useContext(authProvider)

  const autheticate = () => {
    setFormState((previousState) => {
      return { ...previousState, errorMessage: "", showErrorMessage: false, isLoading: true, }
    })
    authenticateUser(formState.key).then(data => {
      setFormState((previousState) => {
        return { ...previousState, isLoading: false }
      })

      login({ isAdmin: !!data.data.is_adm, key: formState.key })

      navigate("/follow-up")

    }).catch((e) => {
      setFormState((previousState) => {
        return {
          ...previousState,
          errorMessage: "Ocorreu um erro no momento da autenticação. Por favor, verificar a chave usada.",
          showErrorMessage: true,
          isLoading: false
        }
      })
    })
  }

  useEffect(() => {

    const { hasSessionOpen, user } = sessionOpen()

    if (hasSessionOpen) {
      login(user)
      navigate("/follow-up")
    }

  }, [])

  return (
    <>

      <Snackbar
        open={formState.showErrorMessage}
        autoHideDuration={6000}
        onClose={() => {
          setFormState((previousState) => {
            return { ...previousState, errorMessage: "", showErrorMessage: false }
          })
        }}
        message={formState.errorMessage}
      />

      <form className={styles.login_form}>
        <fieldset className={styles.login_form_fieldset}>
          <TextField
            type={formState.shouldShowPasswordType ? "password" : "text"}
            label="Chave"
            variant="outlined"
            value={formState.key}
            onChange={(event) => {
              setFormState((previousState) => {
                return { ...previousState, key: event.target.value }
              })
            }}
            fullWidth
            className={styles.login_form_fieldset__input}

            InputProps={{
              endAdornment:
                <IconButton
                  onClick={() => {
                    setFormState((previousState) => {
                      return { ...previousState, shouldShowPasswordType: !previousState.shouldShowPasswordType }
                    })
                  }}
                >
                  {formState.shouldShowPasswordType ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            }}
          />

          <Button
            variant="contained"
            size="medium"
            type="submit"
            fullWidth
            disabled={!formState.key || formState.isLoading}
            onClick={(event) => {
              event.preventDefault();
              autheticate()

            }}
          >

            {!formState.isLoading ? "Enviar" : <CircularProgress size={25} />}
          </Button>
        </fieldset>
      </form>
    </>
  );
}
