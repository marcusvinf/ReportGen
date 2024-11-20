import { Register } from "../interfaces/register";
import { Status } from "../interfaces/status";
import { instance } from "./api.config";

const getStatus = () => {
  return instance.get<{ status: Status[] }>("get_status");
};

const getAnalyst = () => {
  return instance.get<{ analysts: string[] }>("list_analysts");
};

const addInformation = (payload: {
  analyst: string;
  registers: string[];
  activities: string,
  images: string | ArrayBuffer | null
}) => {
  return instance.post<{ information: string }>("information", {
    ...payload,
  });
};

const getInformation = () => {
  return instance.get<{ informations: Register[] }>("information");
};

const authenticateUser = (key: string) => {
  return instance.post<{ verified: boolean, is_adm?: boolean }>("authenticate", { user_key: key })
}
const getResults = () => {
  return instance.get<{ images: string[], information: { activity: string, activity_registers: string }[] }>("information")
}


export { getStatus, addInformation, getAnalyst, getInformation, authenticateUser , getResults};
