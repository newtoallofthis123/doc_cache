import type { APIRoute } from 'astro';
import { API_URL } from '@/constants';

export const GET: APIRoute = async ({ request }) => {
    const res = await fetch(
        `${API_URL}/doctors/${request.headers.get('doc_id')}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: request.headers.get('Authorization') || '',
            },
        }
    )
        .then((res) => res.json())
        .catch((err) => console.log(err));

    return new Response(JSON.stringify(res), {
        headers: { 'content-type': 'application/json' },
    });
};
