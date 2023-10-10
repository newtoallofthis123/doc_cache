import PatientForm from "@/views/patientForm";
import {cookies} from "next/headers";

export default function AddPatient() {
    return (
        <div className='flex flex-col items-center justify-center py-5'>
            <PatientForm update={false} token={cookies().get('token')?.value as string} size='wide' />
        </div>
    )
}