import * as React from "react";
import { cn } from "@/lib/utils";

const Card = ({ className, children, ...props }) => (
  <div className={cn("r border bg-white p-5  ", className)} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn(" text-lg font-semibold", className)} {...props}>
    {children}
  </div>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("text-sm text-gray-600", className)} {...props}>
    {children}
  </div>
);


export { Card, CardHeader, CardContent };
