"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import StepOneForm from "./forms/step-one-form";
import StepTwoForm from "./forms/step-two-form";
import StepThreeForm from "./forms/step-three-form";
import { Cookies } from "react-cookie";

const MIN_STEP = 1;
const MAX_STEP = 3;

type StepState = 1 | 2 | 3;

const CardHeaderState: Record<StepState, React.ReactNode> = {
  1: <h2 className="text-2xl font-bold">Step 1 : Basic Information</h2>,
  2: <h2 className="text-2xl font-bold">Step 2 : Bank Details</h2>,
  3: <h2 className="text-2xl font-bold">Step 3 : Address Details</h2>,
};

const CardContentState: Record<StepState, React.ReactNode> = {
  1: <StepOneForm />,
  2: <StepTwoForm />,
  3: <StepThreeForm />,
};

export default function StepperCard() {
  const currentStep = new Cookies().get("current_step_id");
  const [step, setStep] = useState<StepState>(
    currentStep ? (parseInt(currentStep) as StepState) : (MIN_STEP as StepState)
  );

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
    <Card>
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
