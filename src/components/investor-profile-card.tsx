"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import useSearchParams from "@/lib/useSearchParams";
import StepInvestorOneForm from "./forms/step-investor-one-form";

const MIN_STEP = 1;
const MAX_STEP = 1;

type StepState = 1;

const CardHeaderState: Record<StepState, React.ReactNode> = {
  1: <h2 className="text-2xl font-bold">Step 1 : Basic Information</h2>,
};

const CardContentState: Record<StepState, React.ReactNode> = {
  1: <StepInvestorOneForm />,
};

export default function InvestorProfileCard() {
  const { get, updateSearchParams } = useSearchParams();
  const stepId = (get("step") ?? 1) as StepState;
  const [step, setStep] = useState<StepState>(MIN_STEP);
  useEffect(() => {
    if (stepId >= MIN_STEP && stepId <= MAX_STEP) {
      setStep(stepId);
    } else {
      updateSearchParams({ step: MIN_STEP });
    }
  }, [stepId, updateSearchParams]);

  return (
    <Card>
      <CardHeader className="border-b-2">{CardHeaderState[step]}</CardHeader>
      <CardContent className="p-4">{CardContentState[step]}</CardContent>
    </Card>
  );
}
