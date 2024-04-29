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
  father_name: string;
  mother_name: string;
  spouse_name: string;
  gender: string;
  marital_status: string;
  residential_status: string;
  occupation_type: string;
  country_of_birth: string;
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
  father_name: "",
  mother_name: "",
  spouse_name: "",
  gender: "",
  marital_status: "",
  residential_status: "",
  occupation_type: "",
  country_of_birth: "",
  setStepperStore: (data: StepperStore) => set(data),
}));
