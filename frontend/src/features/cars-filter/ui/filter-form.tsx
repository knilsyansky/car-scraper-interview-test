'use client';

import { Button, Input } from '@shared/ui';
import { filterCarsAction } from '../model/filter-action';
import { useSearchParams } from 'next/navigation';

export function CarFilters() {
    const params = useSearchParams(); 
    const initialBrand = params.get('brand') || '';
    const initialMinPrice = params.get('minPrice') || '';
    const initialMaxPrice = params.get('maxPrice') || '';
    
    return (
        <form action={filterCarsAction} className="mb-8 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Фильтры</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="brand" placeholder="Марка" defaultValue={initialBrand} />
                <Input name="minPrice" type="number" placeholder="Мин. цена" defaultValue={initialMinPrice} />
                <Input name="maxPrice" type="number" placeholder="Макс. цена" defaultValue={initialMaxPrice} />
            </div>
            <Button type="submit" className="mt-4">Применить фильтры</Button>
        </form>
    );
}