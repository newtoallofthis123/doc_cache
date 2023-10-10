'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {useToast} from "@/components/ui/use-toast";
import {backend} from "@/constants";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Doctor, Patient} from "@/types";
import Link from "next/link";

type Props = {
    patient?: Patient;
    token: string;
    size: string;
    update: boolean;
};

export default function PatientForm({ patient, update, token, size = 'small' }: Props) {
    const [docs, setDocs] = React.useState<Doctor[]>([]);
    React.useEffect(() => {
        fetch(backend + '/doctors')
            .then((res) => res.json())
            .then((data) => {
                setDocs(data);
            });
    }
    , []);
    const { toast } = useToast()

    const [name, setName] = React.useState(patient?.full_name || '');
    const [doc_id, setDocID] = React.useState<number | null>(patient?.doc_id || null);
    const url = update ? '/update/' + patient?.p_id : '/new/patient';
    let status: number | null = null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const patient:{ [p: string]: string | File } = Object.fromEntries(data.entries());
        //@ts-ignore
        patient.age = parseInt(patient.age);
        //@ts-ignore
        patient.doc_id = parseInt(doc_id);
        //@ts-ignore
        patient.payment = parseInt(patient.payment);

        const res = await fetch(backend + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify(patient),
        })
            .then((res) => {status = res.status; res.json()})
            .catch((err) => console.log(err));

        if (status == 200) {
            update ? (
                toast({
                    title: 'Patient Updated',
                    description: 'Patient has been Updated successfully!',
                    duration: 3000,
                })
            ):(
                toast({
                title: 'Patient Created',
                description: 'Patient has been created successfully!',
                duration: 3000,
            })
            )
        } else {
            toast({
                title: 'Error',
                description: 'An error occurred while creating the patient!',
                variant: 'destructive',
                duration: 3000,
            })
        }

        !update && typeof window !== 'undefined' && window.location.replace(`/patients/${String(res)}`);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`rounded-xl ${size == 'wide' && 'w-3/5'} shadow-xl`}
        >
            <div className="flex flex-row justify-between bg-neutral-900 text-white w-full px-6 pb-2 pt-4 m-0 rounded-t-md">
                <h1 className="text-xl font-bold">{update?'Update':'Add'} a Patient Record</h1>
                <p className="pt-1 pb-2 text-neutral-100">{name}</p>
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
                        className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-4/5"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="Enter The Full Name of the Patient"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
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
                            defaultValue={patient?.age || ''}
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-3/5"
                            type="number"
                            placeholder="Enter The Age"
                        />
                    </div>
                    <div className="w-1/2 flex flex-row items-center px-2">
                        <Label className="w-2/5 text-base" htmlFor="gender">
                            Gender:
                        </Label>
                        <Input
                            required
                            id="gender"
                            defaultValue={patient?.gender || ''}
                            name="gender"
                            spellCheck="false"
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-3/5"
                            type="text"
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
                            className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-3/5"
                            type="number"
                            defaultValue={patient?.payment || 500}
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
                            className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-3/5"
                            type="phone"
                            defaultValue={patient?.phone || ''}
                            placeholder="Personal Mobile"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="problems">
                        Doctor:
                    </Label>

                    {!update ?(
                        <Select
                            onValueChange={(val: string) => {
                                setDocID(parseInt(val));
                            }}
                        >
                            <SelectTrigger className="w-4/5">
                                <SelectValue placeholder="Choose an available doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Available Doctors</SelectLabel>
                                    {docs.map((doc) => {
                                        return (
                                            <SelectItem
                                                key={doc.doc_id}
                                                value={String(doc.doc_id)}
                                            >
                                                {doc.full_name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ):(<p className='w-4/5'>
                        Doctor ID: <Link className='underline' href={`/docs/${doc_id}`}>#{doc_id}</Link> has already been assigned to this patient.
                    </p>)}
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="problems">
                        Problems:
                    </Label>
                    <Input
                        required
                        id="problems"
                        name="problems"
                        defaultValue={patient?.problems || ''}
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-4/5"
                        type="text"
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
                        defaultValue={patient?.diagnosis || ''}
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-4/5"
                        type="text"
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
                        defaultValue={patient?.medicines || ''}
                        name="medicines"
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-4/5"
                        type="text"
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
                        defaultValue={patient?.description || ''}
                        spellCheck="false"
                        autoComplete="off"
                        className="border-2 border-neutral-200 bg-white dark:bg-neutral-900 w-4/5"
                        placeholder="Description of the Condition"
                    />
                </div>
            </div>
            <div className="flex justify-center pb-4">
                <Button type="submit" className="text-center w-3/5 mt-5">
                    Submit Form Details
                </Button>
            </div>
        </form>
    );
}