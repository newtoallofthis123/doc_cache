import React from 'react'
import { backend } from '@/constants'
import { cookies } from 'next/headers';
import Patient from '@/components/base/patient';
import { Patient as PatientType } from '@/types';

type Props = {}

export default async function AccountPage({ params }: { params: { hash: string } }) {
    const doc_id = params.hash;
    const token = cookies().get('token')?.value as string;
    
    const doc = await fetch(backend + '/doctors/' + doc_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    const pending_patients = await fetch(backend + '/pending/' + doc_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });

    const data = await doc.json();
    const pending = await pending_patients.json();
    
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {pending ?
                pending.map((patient: PatientType) => (
                    <Patient token={token} key={patient.p_id} patient={patient} />
                )) : (
                    <h1 className='text-4xl font-bold py-5 text-center'>No pending patients! 🥳</h1>
                )
            }
        </div>
    );
}