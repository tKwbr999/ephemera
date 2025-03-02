import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black-glow disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-abbey-200 text-abbey-900 hover:bg-abbey-800 hover:text-white focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 dark:bg-abbey-700 dark:text-abbey-50 dark:hover:bg-abbey-600",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline:
          "border border-abbey-300 bg-transparent text-abbey-900 shadow-sm hover:bg-abbey-100 hover:text-abbey-900 dark:border-abbey-600 dark:text-abbey-100 dark:hover:bg-abbey-800 dark:hover:text-abbey-50",
        secondary:
          "bg-abbey-100 text-abbey-900 shadow-sm hover:bg-abbey-200/80 dark:bg-abbey-800 dark:text-abbey-100 dark:hover:bg-abbey-700",
        ghost: "text-abbey-700 hover:bg-abbey-100 hover:text-abbey-900 dark:text-abbey-200 dark:hover:bg-abbey-800 dark:hover:text-abbey-50",
        link: "text-abbey-700 underline-offset-4 hover:underline dark:text-abbey-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
