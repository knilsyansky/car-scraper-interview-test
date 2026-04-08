import { ICar } from "@entities/car/model/types";
import { CarCard } from "@entities/car/ui";
import { CarFilters } from "@features/cars-filter/ui";
import { Pagination } from "@shared/ui";
import { cookies } from "next/headers";
import { stringify } from "querystring";
import { host } from "@shared/api";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { page = null, brand = null, minPrice = null, maxPrice = null } = await searchParams;

    const token = (await cookies()).get('token')?.value;

    const query = {
        ...(page && {page}),
        ...(brand && {brand}),
        ...(minPrice && {minPrice}),
        ...(maxPrice && {maxPrice}),
    };
    const queryString = stringify(query);
    const res = await fetch(`${host}/cars?${queryString}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) {
        console.log(res)
        return <div>Ошибка загрузки данных </div>
    }

    const { data: cars, meta } = await res.json();

    return (
        <main className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3x1 font-bold text-gray-100">Каталог автомобилей</h1>
            </div>

            <CarFilters />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.length > 0 ? (
                    cars.map((car: ICar) => (
                        <CarCard key={car.id} car={car} />
                    ))
                ) : (
                    <p className="text-gray-100">Автомобили не найдены</p>
                )}
            </div>

            <Pagination currentPage={meta.page} lastPage={meta.lastPage} />
        </main>
    );
}
