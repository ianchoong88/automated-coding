
export interface GraphicBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
  imageIndex: number;
}

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
  // Graphics
  logo?: string; // base64 encoded string
  photo?: string; // base64 encoded string
  logoBox?: GraphicBox;
  photoBox?: GraphicBox;
}

export interface ExtractionResponse {
  contact: ContactInfo;
  confidence: number;
}
