import PatientForm from "@/views/patientForm";
import {cookies} from "next/headers";
import {backend} from "@/constants";
import {redirect} from "next/navigation";
import {Patient} from "@/types";

export default async function PatientPage({params}: { params: { hash: string } }) {
    const token = cookies().get('token')?.value as string

    const res = await fetch(backend + '/patients/' + params.hash, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookies().get('token')?.value as string
        }
    });
    const data = await res.json();
    // if data = {}
    if (res.status !== 200) {
        redirect('/404');
    }

    return (
        <div className='px-4 py-2'>
            <PatientForm update={true} token={token} patient={data as Patient} size='small'  />
        </div>
    )
}