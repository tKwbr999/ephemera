import { Cloud, CloudOff } from "lucide-react";
import React from "react";

export type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  {
    name: "Realized",
    path: "/realized",
    icon: React.createElement(Cloud, { className: "h-5 w-5" }),
  },
  {
    name: "Alive",
    path: "/alive",
    icon: React.createElement(Cloud, { className: "h-5 w-5" }),
  },
  {
    name: "Buried",
    path: "/buried",
    icon: React.createElement(CloudOff, { className: "h-5 w-5" }),
  },
];
