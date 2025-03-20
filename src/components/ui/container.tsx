
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div className={cn("fixhub-container", className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
