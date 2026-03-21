import Image from 'next/image';
import { ICar } from '../model/types';
import Link from 'next/link';
import { formatYear, mileageFormat, priceFormat } from '../utils';

export function CarCard({ car }: { car: ICar }) {
    return (
        <Link href={`/cars/${car.id}`} className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-[4/3] w-full bg-gray-200">
                <div
                    className="h-full w-full"
                >
                    <Image
                        width={250}
                        height={185}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={car.imageUrl || '/no-photo.jpg'}
                        alt={`${car.brand} ${car.model}`}
                        loading="lazy"
                    />
                </div>

                <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    {formatYear(car.year)}
                </div>
            </div>

            <div className="p-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {car.brand} <span className="font-normal text-gray-600">{car.model}</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                        {mileageFormat(car.mileage)} км
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <p className="text-xl font-black text-blue-600">
                        {priceFormat(car.price)}
                    </p>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-500 transition-colors">
                        Подробнее
                    </span>
                </div>
            </div>
        </Link>
    );
};