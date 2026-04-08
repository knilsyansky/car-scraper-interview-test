'use server'

import { redirect } from 'next/navigation';

export async function filterCarsAction(formData: FormData) {
    const brand = formData.get('brand');
    const minPrice = formData.get('minPrice');
    const maxPrice = formData.get('maxPrice');

    const params = new URLSearchParams();
    if (brand) params.set('brand', brand.toString());
    if (minPrice) params.set('minPrice', minPrice.toString());
    if (maxPrice) params.set('maxPrice', maxPrice.toString());

    redirect(`?${params.toString()}`);
}