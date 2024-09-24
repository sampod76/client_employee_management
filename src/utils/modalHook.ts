import Swal from "sweetalert2";

export const SuccessModal = (message: string, text = "") => {
  return Swal.fire({
    position: "center",
    icon: "success",
    title: message || "Successful!",
    text: text || "",
    showConfirmButton: false,
    timer: 1800,
  });
};

export const ErrorModal = (error: any) => {
  let message = "Something went wrong!";
  if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object") {
    if (typeof error?.message === "string") {
      message = error?.message;
    } else if (error?.data?.message) {
      message = error?.data?.message;
    } else if (typeof error?.error === "string") {
      message = error?.error;
    }
  }

  return Swal.fire({
    position: "center",
    icon: "error",
    title: message || "Something went wrong!",
    // text: message || "",
    showConfirmButton: false,
    showCancelButton: true,
    timer: 5000,
  });
};

export const ConfirmModal = ({
  message,
  confirmBtnText,
  cancelBtnText,
}: {
  message?: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
}) => {
  return Swal.fire({
    title: "Are you sure?",
    text: message || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#008000",
    cancelButtonColor: "#000",
    confirmButtonText: confirmBtnText || "Yes, delete it!",
    cancelButtonText: cancelBtnText || "Cancel",
  });
};
