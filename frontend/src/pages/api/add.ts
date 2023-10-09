import type { APIRoute } from 'astro';
import { API_URL } from "@/constants";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();

    const res = await fetch(`${API_URL}/new/patient/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': data.token,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .catch((err) => console.log(err));

    return new Response(JSON.stringify(res), {
        headers: { 'content-type': 'application/json' },
    });
};
