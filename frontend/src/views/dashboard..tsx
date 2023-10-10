import PatientForm from "@/views/patientForm";
import {cookies} from "next/headers";
import CreateTable from "@/components/base/table";
import React from "react";

export default function Dashboard() {
    const token = cookies().get('token')?.value || '';

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 mx-5 my-8">
                    <div className="w-full border-2 border-neutral-700 rounded-lg">
                        <PatientForm update={false} token={token} size="small"/>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="p-4 pr-10">
                        <div className="flex flex-col">
                            <CreateTable
                                number={5}
                                default_term="all"
                                small={true}
                                query="all"
                                token={token}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}