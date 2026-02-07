
export interface ContactInfo {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  organization?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
}

export interface ExtractionResponse {
  contact: ContactInfo;
  confidence: number;
}
