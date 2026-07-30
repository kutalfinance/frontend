import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      className="toaster group"
      richColors
      toastOptions={{ style: { fontSize: "14px" } }}
      {...props}
    />
  );
};

export { Toaster };
