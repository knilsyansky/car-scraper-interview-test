export function mileageFormat (mileage: number) {
    return new Intl.NumberFormat('ru-RU').format(mileage);
}

export function priceFormat (price: number) {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
}

export function formatYear (year: number | null): string {
    return String(year || 'N/A');
}