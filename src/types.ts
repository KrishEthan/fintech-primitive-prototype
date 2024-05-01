export type Step = "/kyc-request";

export interface IMobile {
  isd: string;
  number: string;
}
export interface IGeolocation {
  latitude: number;
  longitude: number;
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

export type SearchParams = "step"
