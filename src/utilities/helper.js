import { toast } from "react-toastify";

export const notifySuccess = (message) => {
  toast.success(message, {
    toastId: "form-creation",
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    toastId: "form-creation",
  });
};

export const normalize = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]/gi, "");
};
