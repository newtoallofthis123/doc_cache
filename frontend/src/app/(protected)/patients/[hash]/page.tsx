import {backend} from "@/constants";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import DeletePatient from "@/components/custom/delete";
import Payment from "@/components/custom/paid";
import {Patient} from "@/types";
import Appointment from "@/components/custom/appointment";

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

    const doctor_info = await fetch(backend + '/doctors/' + data.doc_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookies().get('token')?.value as string
        }
    });
    const doctor_data = await doctor_info.json();
    const doc = doctor_data.full_name;

    const appointment_time = Math.floor((new Date(data.next_appointment).getTime() - new Date().getTime()) / (1000 * 3600 * 24))

    return (
        <div className="flex flex-row items-center justify-center py-10">
            <div className="w-4/5 px-16">
                <h1 className="font-heading text-3xl mb-2">
                    Patient <span className="bg-gray-200 dark:text-black">{data.p_id}</span>
                </h1>
                <p>
                    {' '}<span className="text-base font-sans">{!data.paid && '💵 Pending | '}</span>
                    {appointment_time > 0 ? (
                        <span>
                            {data.next_appointment > data.created_at && (
                                <span className="text-gray-600 dark:text-neutral-50">
                                    📅 Next appointment: {new Date(data.next_appointment).toDateString()}. | ➡️ {appointment_time} In days.
                                </span>
                            )}
                        </span>
                    ) : (
                        <span>
                            ❗ Appointment Overdue by {Math.abs(appointment_time)} days.
                        </span>
                    )}
                </p>
                <div
                    className="mt-4 text-lg border-2 gap-y-3 grid border-r-4 border-b-4 border-neutral-800 p-4 rounded-lg shadow-lg">
                    <h3>
                        {data.gender == "Male" ? "👨" : "👧"}{' '}<span className="font-bold">Name:</span>{' '}
                        <span>{data.full_name}</span>
                    </h3>
                    <p>
                        <span className="font-bold">Phone Number: </span>{' '} <Link
                        href={`tel:${data.phone}`}>{data.phone}</Link>
                    </p>
                    <p>
                        <span className="font-bold">Age and Gender:</span>{' '} {data.age} year old {data.gender}
                    </p>
                    <div className="flex flex-row gap-x-2">
                        <p className="font-bold">Description:</p> <p>{data.description}</p>
                    </div>
                    <p>
                        <span
                            className="font-bold">Last Visited: </span>{' '} {new Date(data.created_at).toDateString()}
                    </p>
                    <div>
                        <p className="font-bold">Problems</p>
                        <ul className="ml-10 list-disc">
                            {data.problems.split(";").map((problem: any) => {
                                return (
                                    <li key={problem}>
                                        {problem}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <p>
                        <span className="font-bold">Diagnosis: </span>{' '} {data.diagnosis}
                    </p>
                    <p>
                        <span className="font-bold">🩺 Treated By: </span>{' '} <a className="underline"
                                                                                  href={`/doctors/${data.doc_id}`}>Dr. {doc}</a>
                    </p>
                    <div>
                        <p className="font-bold">💊 Medicines</p>
                        <ul className="ml-10 list-disc">
                            {data.medicines.split(";").map((problem: any) => {
                                return (
                                    <li key={problem}>
                                        {problem}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-1/5 gap-y-8 grid">
                <div className="grid gap-y-2">
                    <Button className="text-xl px-3 py-6 w-4/5"><a href={"/update/" + data.p_id}>🔧
                        Update
                        Details</a></Button>
                    <DeletePatient token={token} p_id={params.hash}/>
                </div>
                <div className="grid gap-y-2">
                    <Payment token={token} patient={data as Patient}/>
                    <Appointment token={token} patient={data as Patient}/>
                </div>
                <div className="grid gap-y-2">
                    <Button variant="secondary" className="text-xl px-3 py-6 w-4/5">🧑‍⚕️ Transfer
                        Doctor️</Button>
                    <Button variant="secondary" className="text-xl px-3 py-6 w-4/5">🖨️ Print
                        Receipt</Button>
                </div>
            </div>
        </div>
    )
}