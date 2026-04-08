import { useRouter, useSearchParams } from 'next/navigation';

export function usePagination() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    return { changePage };
}