import { Outlet, useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import logo from "../../assets/img/logo.png";
import styles from "./MainLayout.module.css";
import TaskIcon from "@mui/icons-material/Task";
import { IconButton, Tooltip } from "@mui/material";
import { authProvider } from "../../contexts/authProvider";
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';


export function MainLayout() {
  const currentDate = new Date();
  const dateLabel = `${currentDate.getDate()}/${currentDate.getMonth() + 1
    }/${currentDate.getFullYear()} `;

  const navigate = useNavigate();

  const { user, logout } = useContext(authProvider)
  
  useEffect(() => {
    if (!user.key) {
      navigate("/")
    }

  }, [user.key])


  return (
    <>
      <header className={styles.main_layout_header}>
        <img src={logo} alt="" className={styles.main_layout_header__logo} />

        <nav className={styles.main_layout_header_nav}>

          <Tooltip title="Navegar para resultados">
            <IconButton
              sx={{ backgroundColor: "white" }}
              onClick={() => {
                navigate("/follow-up");
              }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>


          <Tooltip title="Navegar para resultados">
            <IconButton
              sx={{ backgroundColor: "white" }}
              onClick={() => {
                navigate("results");
              }}
            >
              <TaskIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout da aplicação">
            <IconButton
              sx={{ backgroundColor: "white" }}
              onClick={() => {

                logout()
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </nav>
      </header>

      <h1 className={styles.main_layout_title}>
        Follow UP - <span>{dateLabel}</span>
      </h1>
      <Outlet></Outlet>
    </>
  );
}
