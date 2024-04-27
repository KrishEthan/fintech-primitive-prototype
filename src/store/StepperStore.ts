import { create } from "zustand";

export interface IMobile {
  isd: string;
  number: string;
}

export interface StepperStore {
  pan: string;
  email: string;
  mobile: IMobile;
  name: string;
  date_of_birth: string;
  aadhaar_number: string;
  setStepperStore: (data: StepperStore) => void;
}

export const useStepperStore = create<StepperStore>((set) => ({
  pan: "",
  email: "",
  mobile: {
    isd: "",
    number: "",
  },
  name: "",
  date_of_birth: "",
  aadhaar_number: "",
  setStepperStore: (data: StepperStore) => set(data),
}));
