import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const res = await fetch(`http://localhost:2468/transactions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: request.headers.get('Authorization') || '',
        },
    }).then((res) => res.json());

    return new Response(JSON.stringify(res), {
        headers: { 'content-type': 'application/json' },
    });
};
