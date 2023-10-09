import type { APIRoute } from 'astro';
import { API_URL } from '@/constants';

export const PUT:APIRoute = async ({ request }) => {
    const data = await request.json();
    const req_data = {
        "p_id": data.p_id,
        "next_appointment": data.next_appointment
    }

    const res = await fetch(`${API_URL}/next_appointment`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': data.token
        },
        body: JSON.stringify(req_data)
    }).then(res => res.json()).catch(err => console.log(err));

    return new Response(JSON.stringify(req_data), {
        headers: { 'content-type': 'application/json' },
    });
};