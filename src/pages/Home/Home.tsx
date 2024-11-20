import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import React from "react";
import styles from "./Home.module.css";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  addInformation,
  getAnalyst,
  getStatus,
} from "../../service/api-service";
import { Status } from "../../interfaces/status";
import { authProvider } from "../../contexts/authProvider";

interface StatusState {
  isLoading: boolean;
  isError: boolean;
  analistState: Status[];
}

interface FormState {
  colaborator: string;
  registerCurrentValue: string;
  activity: string;
  register: string[];
  isLoading: boolean;
  hasError: boolean;
  file: string | ArrayBuffer | null ;
}

interface ColaboratorState {
  colaborator: string[];
  isLoading: boolean;
  isError: boolean;
}

export const Home = () => {
  const [colaborators, setColaborators] = useState<ColaboratorState>({
    colaborator: [],
    isError: false,
    isLoading: false,
  });

  const [activities] = useState([
    { name: "VOIP" },
    { name: "Cloud" },
    { name: "FireWall" },
    { name: "SAP" },
    { name: "SALESFORCE" },
    { name: "Desenvolvimento" },
    { name: "Wireless" },
    { name: "Infraestrutura" },
  ]);

  const [statusState, setStatus] = useState<StatusState>({
    isLoading: false,
    isError: false,
    analistState: [],
  });

  const [openedDrawed, setOpenedDrawed] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    colaborator: "",
    activity: "",
    register: [],
    file: "",
    hasError: false,
    isLoading: false,
    registerCurrentValue: "",
  });

  const isValid =
    formState.activity && formState.register.length && formState.colaborator;

  const { user } = useContext(authProvider)


  const submit = () => {
    setFormState((previousState) => {
      return {
        ...previousState,
        isLoading: true,
      };
    });
console.log(formState.file)
    addInformation({
      activities: formState.activity,
      analyst: formState.colaborator,
      registers: formState.register,
      images: formState.file
    })
      .then((data) => {
        setFormState(() => {
          return {
            isLoading: false,
            activity: "",
            colaborator: "",
            hasError: false,
            file: "",
            register: [],
            registerCurrentValue: "",
          };
        });
      })
      .catch((e) => {
        setFormState((previousState) => {
          return {
            ...previousState,
            isLoading: false,
            hasError: true,
          };
        });
      });
  };

  const listAnalyst = () => {
    setColaborators((previousState) => {
      return {
        ...previousState,
        isLoading: true,
        isError: false,
      };
    });
    getAnalyst()
      .then((data) => {
        setColaborators((previousState) => {
          return {
            ...previousState,
            isLoading: false,
            isError: false,
            colaborator: data.data.analysts,
          };
        });
      })
      .catch((e) => {
        setColaborators((previousState) => {
          return {
            ...previousState,
            isLoading: false,
            isError: true,
            colaborator: [],
          };
        });
      });
  };

  const listStatus = () => {
    setStatus((previouState) => {
      return {
        ...previouState,
        isError: false,
        isLoading: true,
      };
    });

    getStatus()
      .then((data) => {
        setStatus(() => {
          return {
            analistState: data.data.status,
            isError: false,
            isLoading: false,
          };
        });
      })
      .catch((e) => {
        setStatus(() => {
          return {
            analistState: [],
            isError: true,
            isLoading: false,
          };
        });
      });
  };

  useEffect(() => {
    listAnalyst();
  }, []);

  useEffect(() => {
    if (openedDrawed) {
      listStatus();
    }
  }, [openedDrawed]);

  if (colaborators.isLoading) {
    return (
      <>
        <section className={styles.section_loading}>
          <CircularProgress
            sx={{
              "--CircularProgress-trackThickness": "4px",
              "--CircularProgress-progressThickness": "-9px",
            }}
            variant={"indeterminate"}
            size={150}
            color="primary"
          />
        </section>
      </>
    );
  }

  if (colaborators.isError) {
    return (
      <section className={styles.section_error}>
        <h2>
          Ocorreu um erro no momento de listar as informações iniciais.
          <span
            onClick={() => {
              listAnalyst();
            }}
          >
            Tente novamente aqui
          </span>
        </h2>
      </section>
    );
  }

  return (
    <>
      <main className={styles.home}>
        <div className={styles.home_section_button}>
          <Button
            variant="contained"
            sx={{ display: "flex", gap: "10px" }}
            onClick={() => {
              setOpenedDrawed(() => {
                return true;
              });
            }}
          >
            Status <QueryStatsIcon></QueryStatsIcon>
          </Button>
        </div>

        <form className={styles.home_form}>
          <FormControl fullWidth>
            <InputLabel>Colaborador:</InputLabel>
            <Select
              value={formState.colaborator}
              onChange={(event) => {
                setFormState((previousState) => {
                  return {
                    ...previousState,
                    colaborator: event.target.value as string,
                  };
                });
              }}
              label="Colaborador:"
            >
              {colaborators.colaborator.map((colaborator) => {
                return (
                  <MenuItem key={colaborator} value={colaborator}>
                    {colaborator}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Atividades:</InputLabel>
            <Select
              value={formState.activity}
              onChange={(event) => {
                setFormState((previousState) => {
                  return {
                    ...previousState,
                    activity: event.target.value as string,
                  };
                });
              }}
              label="Atividades:"
            >
              {activities.map((activity) => {
                return (
                  <MenuItem key={activity.name} value={activity.name}>
                    {activity.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Autocomplete
              clearIcon={false}
              options={[]}
              freeSolo
              multiple
              renderTags={(value, props) =>
                formState.register.map((option, index) => (
                  <div key={option}>
                    <Chip
                      label={option}
                      {...props({ index })}
                      onDelete={() => {
                        setFormState((previousState) => {
                          return {
                            ...previousState,
                            register: previousState.register.filter((regist) => {
                              return regist !== option;
                            }),
                          };
                        });
                      }}
                    />
                  </div>
                ))
              }
              renderInput={(params) => (
                <TextField
                  value={formState.registerCurrentValue}
                  onChange={(event) => {
                    setFormState((previousState) => {
                      return {
                        ...previousState,
                        registerCurrentValue: event.target.value,
                      };
                    });
                  }}
                  label="Registros:"
                  {...params}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      setFormState((previousState) => {
                        return {
                          ...previousState,
                          register: [
                            ...previousState.register,
                            previousState.registerCurrentValue,
                          ],
                          registerCurrentValue: "",
                        };
                      });
                    }
                  }}
                />
              )}
            />
          </FormControl>

          {user.isAdmin ?
            <>
              <FormControl fullWidth>
                <TextField
                  onChange={(event) => {
                    const inputTarget = event.target as HTMLInputElement;

                    const files = inputTarget.files as FileList;

                    if (files) {
                      const reader = new FileReader();
                      reader.readAsDataURL(files[0]);
                      reader.addEventListener("load", (fileEvent) => {
                        const imagebase64 = (fileEvent.currentTarget as FileReader)
                          .result;

                        setFormState((previousState) => {
                          return {
                            ...previousState,
                            file: imagebase64
                          };
                        });
                      });
                    }
                  }}
                  variant="outlined"
                  type="file"
                  inputProps={{
                    accept: ".png, .webp, .jpeg, .bmp",
                    multiple: true,
                  }}
                />
              </FormControl>


            </>

            : <></>

          }
          <Button
            variant="contained"
            size="medium"
            type="submit"
            fullWidth
            disabled={!isValid || formState.isLoading}
            onClick={() => {
              submit();
            }}
          >
            Enviar
          </Button>
        </form>
      </main>

      <Drawer
        anchor={"right"}
        open={openedDrawed}
        onClose={() => {
          setOpenedDrawed(() => {
            return false;
          });
        }}
      >
        <div className={styles.home_drawer}>
          <h2 className={styles.home_drawer_title}>Status:</h2>

          {statusState.isError ? (
            <section className={styles.section_error}>
              <h2>
                Ocorreu um erro no momento de listar as informações de status.
                <span
                  onClick={() => {
                    listStatus();
                  }}
                >
                  Tente novamente aqui
                </span>
              </h2>
            </section>
          ) : (
            <>
              {!statusState.isLoading ? (
                <List>
                  {statusState.analistState.map((analyst) => (
                    <>
                      <ListItem key={analyst.analyst} disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary={analyst.analyst}
                            sx={{
                              fontWeight: "bold",
                              color: analyst.status ? "green" : "red",
                            }}
                          />

                          <ListItemIcon>
                            {analyst.status ? (
                              <CheckCircleOutlineIcon color="success" />
                            ) : (
                              <WarningAmberIcon sx={{ color: "red" }} />
                            )}
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </>
                  ))}
                </List>
              ) : (
                <section className={styles.section_loading}>
                  <CircularProgress
                    sx={{
                      "--CircularProgress-trackThickness": "4px",
                      "--CircularProgress-progressThickness": "-9px",
                    }}
                    variant={"indeterminate"}
                    size={100}
                    color="primary"
                  />
                </section>
              )}
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};
