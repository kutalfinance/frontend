import { toast } from "sonner";

export function successToast(description: string) {
  toast.success("Success", { description });
}

export async function errorToast(err: any) {
  const errResponse = await err.response?.json();

  // TODO: Remove console log in production
  console.log("API Error:", errResponse);

  const title = errResponse?.title ?? "Error";
  const description = errResponse?.detail ?? "Something went wrong. Please try again";
  toast.error(title, { description });
}
