import type { APIRoute } from 'astro';
import { API_URL } from '@/constants';

export const GET: APIRoute = async ({ request }) => {
    const doc_res = await fetch(`${API_URL}/doctors`, {
        method: 'GET',
    }).then((res) => res.json());

    return new Response(JSON.stringify(doc_res), {
        headers: { 'content-type': 'application/json' },
    });
}