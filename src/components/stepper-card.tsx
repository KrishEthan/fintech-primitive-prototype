"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import StepOneForm from "./forms/step-one-form";
import StepTwoForm from "./forms/step-two-form";

const MIN_STEP = 1;
const MAX_STEP = 5;

type StepState = 1 | 2 | 3 | 4 | 5;

const CardHeaderState: Record<StepState, React.ReactNode> = {
  1: <h2 className="text-2xl font-bold">Step 1 : KYC Request</h2>,
  2: <h2 className="text-2xl font-bold">Step 2 : KYC Request</h2>,
  3: <h2 className="text-2xl font-bold">Step 3 : Subscription Details</h2>,
  4: <h2 className="text-2xl font-bold">Step 4 : Payment Details</h2>,
  5: <h2 className="text-2xl font-bold">Step 5 : Confirmation</h2>,
};

const CardContentState: Record<StepState, React.ReactNode> = {
  1: <StepOneForm />,
  2: <StepTwoForm />,
  3: <StepOneForm />,
  4: <StepOneForm />,
  5: <StepOneForm />,
};

export default function StepperCard() {
  const [step, setStep] = useState<StepState>(MIN_STEP);

  const incrementStep = () => {
    if (step < MAX_STEP) {
      setStep((prevStep) => (prevStep + 1) as StepState);
    }
  };

  const decrementStep = () => {
    if (step > MIN_STEP) {
      setStep((prevStep) => (prevStep - 1) as StepState);
    }
  };

  return (
    <Card className="w-1/2">
      <CardHeader className="border-b-2">{CardHeaderState[step]}</CardHeader>
      <CardContent className="p-4">{CardContentState[step]}</CardContent>
      <CardFooter className="p-4 flex items-center justify-between border-t-2">
        {step !== MIN_STEP && (
          <Button variant="outline" onClick={decrementStep}>
            Previous
          </Button>
        )}
        {step !== MAX_STEP && <Button onClick={incrementStep}>Next</Button>}
      </CardFooter>
    </Card>
  );
}