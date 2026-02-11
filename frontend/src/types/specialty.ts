export interface Specialty {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}


export interface CreateSpecialtyDto {
  name: string;
  description: string;
  imageUrl: string;
}

export interface UpdateSpecialtyDto extends CreateSpecialtyDto { }