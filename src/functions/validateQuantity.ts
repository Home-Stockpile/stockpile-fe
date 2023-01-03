export function validateQuantity(quantity: number): string {
  if (quantity > 100) {
    return "Quantity can't be more then 100";
  }
  return "";
}
