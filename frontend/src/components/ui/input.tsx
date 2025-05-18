"use client"; // Đảm bảo đây là Client Component

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority"; // Để định nghĩa các biến thể styling
import { cn } from "../../lib/utils"; // Hàm utility để merge class names


const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
);


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, // Các props chuẩn của <input> (type, value, onChange, placeholder, disabled, v.v.)
    VariantProps<typeof inputVariants> {} // Các props biến thể styling đã định nghĩa ở trên

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type} // Sử dụng prop type
        className={cn(inputVariants(), className)} // Merge các class mặc định, biến thể và class tùy chỉnh
        ref={ref} // Chuyển ref xuống thẻ input DOM thực tế
        {...props} // Truyền các props còn lại (value, onChange, placeholder, v.v.)
      />
    );
  }
);
Input.displayName = "Input"; // Đặt displayName cho component (hữu ích khi debug)

export { Input, inputVariants }; // Export Input component và các biến thể (tùy chọn)