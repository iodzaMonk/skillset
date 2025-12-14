import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface FormItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; // id is required for accessibility (Label htmlFor)
}

export function FormItem({ label, id, className, ...props }: FormItemProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Input id={id} {...props} />
    </div>
  );
}
