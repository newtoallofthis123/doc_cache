import CreateTable from "@/components/base/table";
import {backend} from "@/constants";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Doctor} from "@/types";

export default async function Doctor(){

    const token = cookies().get('token')?.value as string

    const res = await fetch(backend + '/doctors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    const docs = await res.json();
    if(res.status !== 200) {
        redirect('/404');
    }

    const patient_res = await fetch(backend + '/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    const patient_data = await patient_res.json();

    const patients = docs.map((doc: any) => {
        const patients = patient_data.filter((patient: any) => patient.doc_id == doc.doc_id);
        return {
            ...doc,
            patients: patients.length
        }
    });

    type Doctor = {
        doc_id: string,
        full_name: string,
        gov_id: string,
        patients: number
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="pt-5 px-5">
                <h2 className="text-3xl font-bold">
                    The Best Team of Doctors
                </h2>
                <p className="py-3">
                    All managed from your premium doctor dashboard.
                </p>
            </div>
            <div className="flex flex-col gap-y-3 justify-center items-baseline">
                {
                    docs.map((doc: Doctor) => {
                        return (
                            <div key={doc.doc_id}>
                                <h1>
                                    Dr. {doc.full_name}
                                </h1>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}