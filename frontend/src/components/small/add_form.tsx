import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Toastify from 'toastify-js';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    docs: {
        full_name: string;
        docID: number;
    }[];
    token: string;
    size: string;
};

export default function AddForm({ docs, token, size = 'small' }: Props) {
    const [name, setName] = React.useState('');
    const [doc_id, setDocID] = React.useState<number>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const patient = Object.fromEntries(data.entries());
        //age is a number
        //@ts-ignore
        patient.age = parseInt(patient.age);
        //doc_id is a number
        //@ts-ignore
        patient.doc_id = parseInt(doc_id);
        //payments is a number
        //@ts-ignore
        patient.payment = parseInt(patient.payment);
        patient.token = token;

        const res = await fetch('/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            mode: 'no-cors',
            body: JSON.stringify(patient),
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));

        if (res == 'Patient Created') {
            Toastify({
                text: 'Patient Created Successfully!',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: '#d0fdba',
                },
            }).showToast();
        } else {
            Toastify({
                text: 'Patient Creation Failed!',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: '#f9a8a8',
                },
            }).showToast();
        }

        typeof window !== 'undefined' && window.location.replace(`/patients/${String(res)}`);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`rounded-xl ${size == 'wide' && 'w-2/3'} shadow-xl`}
        >
            <div className="flex flex-row justify-between bg-neutral-900 text-white w-full px-6 pb-2 pt-4 m-0 rounded-t-md">
                <h1 className="text-xl font-bold">Add a Patient Record</h1>
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
                        className="border-2 border-neutral-200 bg-white w-4/5"
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
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white w-3/5"
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
                            name="gender"
                            spellCheck="false"
                            autoComplete="off"
                            className="border-2 border-neutral-200 bg-white w-3/5"
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
                            className="border-2 border-neutral-200 bg-white w-3/5"
                            type="number"
                            defaultValue={500}
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
                            placeholder="Personal Mobile"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="problems">
                        Doctor:
                    </Label>
                    <Select
                        onValueChange={(val) => {
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
                                            key={doc.docID}
                                            value={String(doc.docID)}
                                        >
                                            {doc.full_name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
