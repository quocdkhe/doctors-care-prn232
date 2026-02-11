export interface Specialty {
  id: string;
  name: string;
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

export interface UpdateSpecialtyDto extends CreateSpecialtyDto { }
