export interface BasketItem {
  productId: string;
  name: string;
  description: string;
  /** Unit price in won, already discounted at the time it was added. */
  price: number;
  quantity: number;
  /** Raw API path, resolved against REACT_APP_API_URL at render time. */
  image: string;
}
