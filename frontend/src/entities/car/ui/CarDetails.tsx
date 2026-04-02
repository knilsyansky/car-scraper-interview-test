import { ICar } from '../model/types';
import { cn } from '@shared/lib';
import Image from 'next/image';
import { formatYear, mileageFormat, priceFormat } from '../utils';

export function CarDetails({ car }: { car: ICar }) {

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-900 p-6 rounded-3xl shadow-sm'>
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
                <Image src={car.imageUrl} width={450} height={340} className="w-full h-auto" alt={car.model} />
            </div>

            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-5xl font-black">{car.brand}</h1>
                    <p className="text-2xl text-gray-500">{car.model}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Year" value={formatYear(car.year)} />
                    <DetailItem label="Mileage" value={mileageFormat(car.mileage)} />
                    <DetailItem label="Price" value={priceFormat(car.price)} className="text-blue-600 font-bold" />
                    {car.details && Object.entries(car.details).map(([key, val]) => (
                        <DetailItem key={key} label={key} value={String(val)} />
                    ))}
                </div>
            </div>
        </div>
    );
}


const DetailItem = ({ label, value, className }: { label: string, value: string, className?: string }) => (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs text-gray-400 uppercase font-bold">{label}</p>
        <p className={cn("text-lg font-medium text-gray-500", className)}>{value || '—'}</p>
    </div>
);