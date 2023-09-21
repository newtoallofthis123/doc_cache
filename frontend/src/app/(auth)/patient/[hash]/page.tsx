import React from 'react';
import { cookies } from 'next/headers';

type Props = {};

async function getPatientData(hash: string) {
    const response = await fetch(`http://localhost:2468/patients/${hash}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookies().get('token')?.value || '',
        },
    });
    const data = await response.json();
    return data;
}

export default async function Patient({
    params,
}: {
    params: { hash: string };
    }) {
    const data = await getPatientData(params.hash);
    return (
        <div>
            <p>
                {data.full_name}
            </p>
        </div>
    );
}
