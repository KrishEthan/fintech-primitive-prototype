import React from "react";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";

export default function StepOneForm() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input placeholder="Name" />
      <Input placeholder="Pan" />
      <Input placeholder="Email" />
      <Input placeholder="Number" type="number" />
    </div>
  );
}
