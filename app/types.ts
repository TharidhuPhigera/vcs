export interface Cargo {
  _id?: string; // Optional because it won't exist when creating a new cargo
  referenceNumber: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  unitCount: number;
  payment: string;
  note: string;
  imageUrl: string;
  password: string;
}