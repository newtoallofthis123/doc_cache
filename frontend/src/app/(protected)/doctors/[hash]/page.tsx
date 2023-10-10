import CreateTable from "@/components/base/table";
import {backend} from "@/constants";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Doctor({ params }: { params: { hash: string } }){

    const token = cookies().get('token')?.value as string

    const res = await fetch(backend + '/doctors/' + params.hash, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    const doc_data = await res.json();
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

    const patients = patient_data.filter((patient: any) => patient.doc_id == params.hash);

    return (
        <div>
            <div className="pt-5 px-5">
                <h2 className="text-3xl font-bold">
                    Welcome back,
                    <span className="underline">Dr {doc_data.full_name}</span>
                </h2>
                <p className="py-3">
                    To your premium doctor dashboard.
                </p>
            </div>
            <div className="mx-5 w-1/2">
                <CreateTable token={token} initial={patients} small={true} query="display" default_term={''}/>
            </div>
        </div>
    )
}