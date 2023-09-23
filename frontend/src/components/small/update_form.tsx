import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Toastify from 'toastify-js';
import Appointment from "@/components/small/appointment.tsx";
import DeletePatient from "@/components/small/delete.tsx";
import Payment from "@/components/small/payment.tsx";

export type Props = {
    token: string;
    size: string;
    doctor: string;
    patient_raw: Patient;
};

type Patient = {
    full_name: string,
    age: number,
    gender: string,
    p_id: number,
    payment: number,
    phone:  string,
    doc_id: number,
    problems: string,
    diagnosis: string,
    medicines: string,
    description: string,
    paid: boolean,
    next_appointment: string,
    created_at: string,
}

export default function UpdateForm({ patient_raw, doctor, token, size="small" }: Props) {
    const [patient, setPatient] = React.useState(patient_raw);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const patient = Object.fromEntries(data.entries());
        //age is a number
        //@ts-ignore
        patient.age = parseInt(patient.age);
        //doc_id is a number
        //@ts-ignore
        patient.doc_id = parseInt(patient.doc_id);
        //payments is a number
        //@ts-ignore
        patient.payment = parseInt(patient.payment);

        console.log(token);

        const res = await fetch(`http://localhost:2468/update/${patient_raw.p_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(patient),
            mode: 'no-cors',
        }).then((res) => res.json()).catch((err) => console.log(err));

        if (res == "Patient Created") {
            Toastify({
                text: 'Patient Created Successfully!',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: '#d0fdba',
                }
            }).showToast();
        } else {
            Toastify({
                text: 'Patient Creation Failed!',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: '#f9a8a8',
                }
            }).showToast();
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`rounded-xl ${size == "wide" && 'w-2/3'} shadow-xl`}
        >
            <div className="flex flex-col justify-between bg-neutral-900 text-white w-full px-6 pb-2 pt-4 m-0">
                <div className='flex flex-row justify-between items-center'>
                    <DeletePatient patient={patient} client:load />
                    <Payment patient={patient} client:load />
                    <Appointment patient={patient} token={token} />
                </div>
            </div>
            <div className="grid gap-y-5 py-2 px-8 ">
                <div className="flex flex-row justify-center pt-2 items-center">
                    <Label className="w-1/5 text-base" htmlFor="full_name">
                        Name:
                    </Label>
                    <Input
                        required
                        id="full_name"
                        name="full_name"
                        className="border-2 border-neutral-200 bg-white w-4/5"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="Enter The Full Name of the Patient"
                        value={patient.full_name}
                        onChange={(e: any) => {
                            setPatient({ ...patient, full_name: e.target.value });
                        }}
                    />
                </div>
                <div className="flex flex-row justify-center items-center">
                    <div className="w-1/2 flex flex-row items-center px-2">
                        <Label className="w-2/5 text-base" htmlFor="age">
                            Age:
                        </Label>
                        <Input
                            required
                            id="age"
                            name="age"
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white w-3/5"
                            type="number"
                            placeholder="Enter The Age"
                            value={patient.age}
                            onChange={(e: any) => {
                                setPatient({ ...patient, age: parseInt(e.target.value) });
                            }}
                        />
                    </div>
                    <div className="w-1/2 flex flex-row items-center px-2">
                        <Label className="w-2/5 text-base" htmlFor="gender">
                            Gender:
                        </Label>
                        <Input
                            required
                            id="gender"
                            name="gender"
                            spellCheck="false"
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white w-3/5"
                            type="text"
                            value={patient.gender}
                            onChange={(e: any) => {
                                setPatient({ ...patient, gender: e.target.value });
                            }}
                            placeholder="Gender of the Patient"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <div className="w-1/2 flex flex-row px-2">
                        <Label className="w-2/5 text-base" htmlFor="payment">
                            Payment:
                        </Label>
                        <Input
                            required
                            id="payment"
                            name="payment"
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white w-3/5"
                            type="number"
                            value={patient.payment}
                            onChange={(e: any) => {
                                setPatient({ ...patient, payment: parseInt(e.target.value) });
                            }}
                            placeholder="Fee and Medicines Cost"
                        />
                    </div>
                    <div className="w-1/2 flex flex-row px-2">
                        <Label className="w-2/5 text-base" htmlFor="phone">
                            Phone Number:
                        </Label>
                        <Input
                            required
                            id="phone"
                            name="phone"
                            spellCheck="false"
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white w-3/5"
                            type="phone"
                            value={patient.phone}
                            onChange={(e: any) => {
                                setPatient({ ...patient, phone: e.target.value });
                            }}
                            placeholder="Personal Mobile"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="doc_id">
                        Doctor ID:
                    </Label>
                    <p className='w-4/5'>
                        Please use the transfer patient option to change the doctor.
                        The doctor ID {patient.doc_id} (<span className='underline'>{doctor}</span>) will be used for this patient.
                    </p>
                    <Input
                        readOnly
                        required
                        value={patient.doc_id}
                        id="doc_id"
                        name="doc_id"
                        autoComplete="off"
                        className="hidden border-2 border-neutral-200 bg-white w-4/5"
                        type="text"
                    />
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="problems">
                        Problems:
                    </Label>
                    <Input
                        required
                        id="problems"
                        name="problems"
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white w-4/5"
                        type="text"
                        value={patient.problems}
                        onChange={(e: any) => {
                            setPatient({ ...patient, problems: e.target.value });
                        }}
                        placeholder="Patient Problems, Separated by ;"
                    />
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="diagnosis">
                        Diagnosis:
                    </Label>
                    <Input
                        required
                        id="diagnosis"
                        name="diagnosis"
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white w-4/5"
                        type="text"
                        value={patient.diagnosis}
                        onChange={(e: any) => {
                            setPatient({ ...patient, diagnosis: e.target.value });
                        }}
                        placeholder="Suitable Diagnosis for the Patient"
                    />
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="medicines">
                        Medicines:
                    </Label>
                    <Input
                        required
                        id="medicines"
                        name="medicines"
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white w-4/5"
                        type="text"
                        value={patient.medicines}
                        onChange={(e: any) => {
                            setPatient({ ...patient, medicines: e.target.value });
                        }}
                        placeholder="Medicines Prescribed, Separated by ;"
                    />
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="description">
                        Description:
                    </Label>
                    <Textarea
                        required
                        id="description"
                        name="description"
                        spellCheck="false"
                        autoComplete="off"
                        value={patient.description}
                        onChange={(e: any) => {
                            setPatient({ ...patient, description: e.target.value });
                        }}
                        className="border-2 border-neutral-200 bg-white w-4/5"
                        placeholder="Description of the Condition"
                    />
                </div>
            </div>
            <div className="flex justify-center pb-4">
                <Button type="submit" className="text-center w-3/5 mt-5">
                    Add The Patient
                </Button>
            </div>
        </form>
    );
}
