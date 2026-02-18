export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpecialtyDto {
  name: string;
  description: string;
  imageUrl: string | null;
}

export interface SpecialtyInfo {
  specialtySlug: string;
  specialtyName: string;
  specialtyDescription: string;
  specialtyImage?: string;
}

export interface UpdateSpecialtyDto extends CreateSpecialtyDto {}
