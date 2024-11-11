import Toast from "./Toast.tsx";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const ToastProvider = ({ toasts }: { toasts: Toast[] }) => {
  return (
    <div className={"absolute z-50 flex flex-col gap-2 top-10 right-10"}>
      {toasts.map((toast: Toast) => {
        return (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        );
      })}
    </div>
  );
};

export default ToastProvider;
