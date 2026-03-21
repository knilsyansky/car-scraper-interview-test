export interface ICar {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number | null;
  mileage: number;
  imageUrl: string;
  details?: object | object[] | [] | null;
}