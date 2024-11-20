import { useEffect, useRef, useState } from "react";
import React from "react";
import { getResults } from "../../service/api-service";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import styles from "./Results.module.css";
import results from "../../assets/img/results-img.png";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface Register {
  image: string;
  name: string;
  activities: {
    description: string;
    registers: string[];
  }[];
}

export const Results = () => {
  const [registersState, setRegisterState] = useState<{
    registers: Register[];
    isLoading: boolean;
    isError: boolean;
  }>({
    isError: false,
    isLoading: false,
    registers: [],
  });


  const getRegisters = () => {
    setRegisterState((previousState) => {
      return { ...previousState, isLoading: true, isError: false };
    });

    getResults()
      .then((data) => {
        const groupBy = data.data.information.reduce(
          (acumulator, currentValue) => {
            const hasBackOffice = currentValue.activity.includes("BackOffice");

            if (hasBackOffice) {
              acumulator[1] = {
                ...acumulator[1],
                activities: [
                  ...acumulator[1].activities,
                  {
                    description: currentValue.activity,
                    registers: currentValue.activity_registers.split("\n"),
                  },
                ],
              };
            } else {
              acumulator[0] = {
                ...acumulator[0],
                activities: [
                  ...acumulator[0].activities,
                  {
                    description: currentValue.activity,
                    registers: currentValue.activity_registers.split("\n"),
                  },
                ],
              };
            }

            return acumulator;
          },
          [
            {
              image: data.data.images[0],
              name: "SD",
              activities: [] as {
                description: string;
                registers: string[];
              }[],
            },
            {
              image: data.data.images[1],
              name: "BACKOFFICE",
              activities: [],
            },
          ]
        );

        setRegisterState((previousState) => {
          return { ...previousState, isLoading: false, registers: groupBy };
        });
      })
      .catch((e) => {
        setRegisterState((previousState) => {
          return { ...previousState, isLoading: false, isError: true };
        });
      });
  };

  useEffect(() => {
    getRegisters();
  }, []);

  if (registersState.isError) {
    return (
      <section className={styles.section_error}>
        <h1>
          Ocorreu um erro no momento de listar as informações registradas.
          <span
            onClick={() => {
              getResults();
            }}
          >
            Tente novamente aqui
          </span>
        </h1>
      </section>
    );
  }

  if (registersState.isLoading) {
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

  return (
    <>
      <div className={styles.icon_button_section}>
        <Tooltip title="Exportar aquivos">
          <IconButton
            sx={{ backgroundColor: "#1275b8", color: "white" }}
            onClick={() => {


              window.print();

            }}
          >
            <FileUploadIcon />
          </IconButton>
        </Tooltip>
      </div>

      <section  className={styles.section_main}>
        <img src={results} alt="" className={styles.image_logo} />
        {registersState.registers.map(({ name, activities, image }) => {
          return (
            <div
              key={name}
              style={{
                marginBottom: "300px",
                paddingBottom: "10px",
                borderBottom: "1px solid  #33bdee",
              }}
            >
              <h2>{name}</h2>

              <div className={styles.section_register}>
                <section style={{ width: "70%" }}>
                  {activities.map(({ description, registers }) => {
                    return (
                      <>
                        <div
                          key={description}
                          className={styles.section_register_item}
                        >
                          <div>
                            <h3>{description}</h3>
                          </div>
                          <ul>
                            {registers.map((name) => (
                              <li key={name}> {name}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    );
                  })}
                </section>

                {image ? (
                  <img
                    src={image}
                    alt="Foto"
                    className={styles.section_main_image}
                  />
                ) : (
                  <>Nenhuma imagem selecionada</>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};
