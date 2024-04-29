"use client";
import { Step } from "@/types";
import React from "react";

interface ISidebarProps {
  onSidebarItemClick: (item: Step) => void;
}

export default function Sidebar({ onSidebarItemClick }: ISidebarProps) {
  return (
    <div className="w-64 p-4 space-y-8 border-2 border-slate-100">
      <h1 className="text-xl font-bold">Fintech Primitive</h1>
      <div className="flex flex-col">
        <p
          className="text-md py-2"
          onClick={() => onSidebarItemClick("/kyc-request")}
        >
          KYC Request
        </p>
      </div>
    </div>
  );
}
