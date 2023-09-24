import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import Toastify from 'toastify-js';
import {useForm} from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

type Props = {
    docs: {
        full_name: string;
        docID: number;
    }[];
    token: string;
    size: string;
};

const formSchema = z.object({
    full_name: z.string().min(2).max(100),
    age: z.number().min(1).max(100),
    gender: z.string().min(2).max(10),
    payment: z.number().min(0).max(10000),
    phone: z.string().min(10).max(10),
    doc_id: z.number().min(1).max(100),
    problems: z.string().min(2).max(100),
    diagnosis: z.string().min(2).max(100),
    medicines: z.string().min(2).max(100),
    description: z.string().min(2).max(100),
})

export default function FutureAdd({ docs, token, size="small" }: Props) {
    const [name, setName] = React.useState('');
    const [doc_id, setDocID] = React.useState<number>();

    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>){
        console.log(values);
    }

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

        typeof window !== 'undefined' && window.location.replace(`/patient/${String(res)}`);
    }

    return (
        <Form {...form}>
            <form
                // @ts-ignore
                onSubmit={form.handleSubmit(onSubmit)}
                className={`rounded-xl ${size == "wide" && 'w-2/3'} shadow-xl`}
            >
                <div className="flex flex-row justify-between bg-neutral-900 text-white w-full px-6 pb-2 pt-4 m-0 rounded-t-md">
                    <h1 className="text-xl font-bold">Add a Patient Record</h1>
                </div>
                <div className="grid gap-y-5 py-2 px-8 ">
                    <div className="flex flex-row justify-center pt-2 items-center">
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-center items-center w-full">
                                    <FormLabel className="w-1/5">Full Name</FormLabel>
                                    <FormControl>
                                        <Input className="border-2 border-neutral-200 bg-white w-4/5" placeholder="Enter The Full Name of the Patient" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <div className="w-1/2 flex flex-row items-center px-2">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row justify-center items-center w-full">
                                        <FormLabel className="w-2/5">Age</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="border-2 border-neutral-200 bg-white w-3/5" placeholder="Age of the patient" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/2 flex flex-row items-center px-2">
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row justify-center items-center w-full">
                                        <FormLabel className="w-2/5">Gender</FormLabel>
                                        <FormControl>
                                            <Input className="border-2 border-neutral-200 bg-white w-3/5" placeholder="Patient Gender" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <div className="w-1/2 flex flex-row px-2">
                            <FormField
                                control={form.control}
                                name="payment"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row justify-center items-center w-full">
                                        <FormLabel className="w-2/5">Payment</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="border-2 border-neutral-200 bg-white w-3/5" placeholder="Doctor Fees" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/2 flex flex-row px-2">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row justify-center items-center w-full">
                                        <FormLabel className="w-2/5">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="border-2 border-neutral-200 bg-white w-3/5" placeholder="Patient's Phone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center px-2">
                        <FormField
                            control={form.control}
                            name="doc_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an available doctor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Doctors</SelectLabel>
                                                {
                                                    docs.map((doc) => (
                                                        <SelectItem key={doc.docID} value={String(doc.docID)}>
                                                            {doc.full_name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center px-2">
                        <FormField
                            control={form.control}
                            name="problems"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-center items-center w-full">
                                    <FormLabel className="w-1/5">Problems</FormLabel>
                                    <FormControl>
                                        <Input className="border-2 border-neutral-200 bg-white w-4/5" placeholder="Problems Reported by the patient" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center px-2">
                        <FormField
                            control={form.control}
                            name="diagnosis"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-center items-center w-full">
                                    <FormLabel className="w-1/5">Diagnosis</FormLabel>
                                    <FormControl>
                                        <Input className="border-2 border-neutral-200 bg-white w-4/5" placeholder="Patient Diagnois and Care" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center px-2">
                        <FormField
                            control={form.control}
                            name="medicines"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-center items-center w-full">
                                    <FormLabel className="w-1/5">Medicines</FormLabel>
                                    <FormControl>
                                        <Input className="border-2 border-neutral-200 bg-white w-4/5" placeholder="Medicines Prescribed to the patient" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center px-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-center items-center w-full">
                                    <FormLabel className="w-1/5">Description</FormLabel>
                                    <FormControl>
                                        <Textarea className="border-2 border-neutral-200 bg-white w-4/5" placeholder="Notes about the patient" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-center pb-4">
                    <Button type="submit" className="text-center w-3/5 mt-5">
                        Add The Patient
                    </Button>
                </div>
            </form>
        </Form>
    );
}
