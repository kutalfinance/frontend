import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-background flex h-10 w-full min-w-0 rounded border px-3 py-1 text-base transition-[color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ type, ...props }, ref) => {
  const [showPassword, toggleShowPassword] = React.useReducer((prev) => !prev, false);
  const Icon = showPassword ? EyeOff : Eye;
  type = showPassword ? "text" : "password";

  return (
    <div className="relative">
      <Input type={type} ref={ref} {...props} />
      <Icon
        size={16}
        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        onClick={toggleShowPassword}
      />
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
