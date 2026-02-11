export interface Clinic {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  city: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClinic {
  name: string;
  description: string;
  imageUrl: string;
  city: string;
  address: string;
}

export interface UpdateClinic extends CreateClinic { }