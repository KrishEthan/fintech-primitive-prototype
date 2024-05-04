"use client";
import React, { useState, Suspense } from "react";
import Sidebar from "@/components/sidebar";
import StepperCard from "@/components/stepper-card";
import { Step } from "@/types";
import { DayPickerProvider } from "react-day-picker";
import InvestorProfileCard from "@/components/investor-profile-card";

const stepsLookup: Record<Step, React.ReactNode> = {
  "/kyc-request": <StepperCard />,
  "/investor-profile": <InvestorProfileCard />,
};

export default function Home() {
  const [activeStep, setActiveStep] = useState<Step>("/kyc-request");
  const onSidebarItemClick = (item: Step) => {
    setActiveStep(item);
  };
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <DayPickerProvider initialProps={{}}>
        <div className="h-screen w-screen flex">
          <Sidebar onSidebarItemClick={onSidebarItemClick} />
          <div className="flex-1 p-8 bg-gray-100">
            {stepsLookup[activeStep]}
          </div>
        </div>
      </DayPickerProvider>
    </Suspense>
  );
}
