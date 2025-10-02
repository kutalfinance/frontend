import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export function Loader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)} {...props}>
      <LoaderCircle className="text-primary size-8 animate-spin" />
    </div>
  );
}
