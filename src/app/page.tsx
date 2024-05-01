"use client";
import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import StepperCard from "@/components/stepper-card";
import { Step } from "@/types";
import { DayPickerProvider } from "react-day-picker";

const stepsLookup: Record<Step, React.ReactNode> = {
  "/kyc-request": <StepperCard />,
};

export default function Home() {
  const [activeStep, setActiveStep] = useState<Step>("/kyc-request");
  const onSidebarItemClick = (item: Step) => {
    setActiveStep(item);
  };
  return (
    <DayPickerProvider initialProps={{}}>
      <div className="h-screen w-screen flex">
        <Sidebar onSidebarItemClick={onSidebarItemClick} />
        <div className="flex-1 p-8 bg-gray-100">{stepsLookup[activeStep]}</div>
      </div>
    </DayPickerProvider>
  );
}
