
export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  category: PasswordCategory;
  notes?: string;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PasswordCategory = 
  | 'website'
  | 'application'
  | 'banking'
  | 'email'
  | 'social'
  | 'other';

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
}
