import Link from 'next/link';
import { notFound } from 'next/navigation';
import { host } from '@shared/api';
import { Button } from '@shared/ui';
import { CarDetails } from '@entities/car/ui';
import { cookies } from 'next/headers';

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const token = (await cookies()).get('token')?.value;

    const res = await fetch(`${host}/cars/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store',
    });
    if (res.status === 404 || res.status === 401) {
        notFound()
    }
    const car = await res.json();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-12">
            <header className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md mb-8">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            ← Назад к списку
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4">
                <CarDetails car={car} />
            </main>
        </div>
    );
}