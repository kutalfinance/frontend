import { useLoggedInUser } from "@/hooks/data";

export function Permissions() {
  const { data } = useLoggedInUser();

  console.log(data);

  return <></>;
}
