"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import StepOneForm from "./forms/step-one-form";
import StepTwoForm from "./forms/step-two-form";
import StepThreeForm from "./forms/step-three-form";
import useSearchParams from "@/lib/useSearchParams";
import StepFourForm from "./forms/step-four-form";
import StepFiveForm from "./forms/step-five-form";

const MIN_STEP = 1;
const MAX_STEP = 5;

type StepState = 1 | 2 | 3 | 4 | 5;

const CardHeaderState: Record<StepState, React.ReactNode> = {
  1: <h2 className="text-2xl font-bold">Step 1 : Basic Information</h2>,
  2: <h2 className="text-2xl font-bold">Step 2 : Bank Details</h2>,
  3: <h2 className="text-2xl font-bold">Step 3 : Address Details</h2>,
  4: <h2 className="text-2xl font-bold">Step 4 : Upload Documents</h2>,
  5: <h2 className="text-2xl font-bold">Step 5 : ESign Documents</h2>,
};

const CardContentState: Record<StepState, React.ReactNode> = {
  1: <StepOneForm />,
  2: <StepTwoForm />,
  3: <StepThreeForm />,
  4: <StepFourForm />,
  5: <StepFiveForm />,
};

export default function StepperCard() {
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
