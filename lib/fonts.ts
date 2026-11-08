import { Inter } from "next/font/google";

/*
 * Apple-style type. The stack in globals.css asks for the system font first,
 * so Apple devices render SF Pro (the licence doesn't allow serving it as a
 * web font). Inter is the fallback everywhere else; browsers only download it
 * when the system font isn't SF.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontVariables = inter.variable;
