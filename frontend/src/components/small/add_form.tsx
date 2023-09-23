import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Toastify from 'toastify-js';

type Props = {
    doc: {
        name: string;
        number: number;
    };
    token: string;
};

export default function AddForm({ doc, token }: Props) {
    const [name, setName] = React.useState('');

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

        const res = await fetch('http://localhost:2468/new/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
            body: JSON.stringify(patient),
        }).then((res) => res.json()).catch((err) => console.log(err));

        if (res == "Patient Created") {
            Toastify({
                text: 'Patient Created Successfully!',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                backgroundColor: '#d0fdba',
            }).showToast();
        } else {
            Toastify({
                text: 'Patient Creation Failed!',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                backgroundColor: '#f9a8a8',
            }).showToast();
        }

        typeof window !== 'undefined' && window.location.reload();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-sky-200 rounded-lg py-5 px-8 m-0 shadow-xl drop-shadow-lg"
        >
            <h1 className="text-2xl font-bold">Patient</h1>
            <p className="pt-1 pb-2 text-neutral-600">
                {name} treated by {doc.name}
            </p>
            <div className="grid gap-y-5">
                <div className="flex flex-row justify-center items-center">
                    <Label className="w-1/5 text-base" htmlFor="full_name">
                        Name:
                    </Label>
                    <Input
                        required
                        id="full_name"
                        name="full_name"
                        className="border-0 bg-white w-4/5"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="Enter The Full Name of the Patient"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-row justify-center items-center">
                    <div className="w-1/2 flex flex-row justify-center items-center px-2">
                        <Label className="w-1/5 text-base" htmlFor="age">
                            Age:
                        </Label>
                        <Input
                            required
                            id="age"
                            name="age"
                            autoComplete="off"
                            className="border-0 bg-white w-4/5"
                            type="number"
                            placeholder="Enter The Age"
                        />
                    </div>
                    <div className="w-1/2 flex flex-row justify-center items-center px-2">
                        <Label className="w-1/5 text-base" htmlFor="gender">
                            Gender:
                        </Label>
                        <Input
                            required
                            id="gender"
                            name="gender"
                            spellCheck="false"
                            autoComplete="off"
                            className="border-0 bg-white w-4/5"
                            type="text"
                            placeholder="Gender of the Patient"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="doc_id">
                        Doctor ID:
                    </Label>
                    <Input
                        readOnly
                        required
                        defaultValue={doc.number}
                        id="doc_id"
                        name="doc_id"
                        autoComplete="off"
                        className="border-0 bg-white w-4/5"
                        type="text"
                        placeholder={doc.name}
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
                        className="border-0 bg-white w-4/5"
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
                        className="border-0 bg-white w-4/5"
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
                        className="border-0 bg-white w-4/5"
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
                        className="border-0 bg-white w-4/5"
                        placeholder="Description of the Condition"
                    />
                </div>
                <div className="flex flex-row justify-center items-center px-2">
                    <Label className="w-1/5 text-base" htmlFor="phone">
                        Phone Number:
                    </Label>
                    <Input
                        required
                        id="phone"
                        name="phone"
                        spellCheck="false"
                        autoComplete="off"
                        className="border-0 bg-white w-4/5"
                        type="phone"
                        placeholder="Phone Number of the Patient"
                    />
                </div>
            </div>
            <Button type="submit" className="w-3/5 mt-5">
                Add The Patient
            </Button>
        </form>
    );
}
