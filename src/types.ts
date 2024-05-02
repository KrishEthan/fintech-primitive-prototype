export type Step = "/kyc-request";

export interface IKycRequestError {
  status: number;
  message: string;
  errors: string[];
}

export interface IMobile {
  isd: string;
  number: string;
}
export interface IGeolocation {
  latitude: number;
  longitude: number;
}

export interface IKycRequest {
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
  geolocation: IGeolocation;
}

export interface IKycResponse extends IKycRequest {
  id: string;
  error: IKycRequestError;
}
export interface IFileRequest {
  file: File | undefined;
  purpose?: string;
}

export interface IFileResponse {
  id: string;
  created_at: string;
  filename: string;
  content_type: string;
  purpose: null;
  byte_size: number;
  url: string;
  object: string;
}

export type SearchParams = "step";
