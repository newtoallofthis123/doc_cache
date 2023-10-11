'use client'

import { Patient } from '@/types'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { backend } from '@/constants';
import { useToast } from '../ui/use-toast';

type Props = {
    patient: Patient;
    token: string;
}

export default function Patient({ patient, token }: Props) {
    const {toast} = useToast();
    return (
        <div className="my-5 mx-2">
            <Card className="shadow-sm hover:shadow-lg transform transition-all duration-500">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {patient.gender == 'Male' ? '👨' : '👧'}{' '}
                        {patient.full_name}
                    </CardTitle>
                    <CardDescription>🟡 Pending</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="gap-y-1 grid">
                        <p>
                            {patient.age} year old {patient.gender}
                        </p>
                        <div className="flex flex-row gap-x-2">
                            <p>{patient.description}</p>
                        </div>
                        <div>
                            <p className="font-bold">Problems</p>
                            <ul className="ml-10 list-disc">
                                {patient.problems
                                    .split(';')
                                    .map((problem: any) => {
                                        return <li key={problem}>{problem}</li>;
                                    })}
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => {
                        fetch(backend + '/complete', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            },
                            body: JSON.stringify({
                                p_id: patient.p_id,
                                //@ts-ignore
                                doc_id: parseInt(patient.doc_id)
                            })
                        }).then(res => {
                            if (res.status == 200) {
                                toast({
                                    title: 'Patient marked as done',
                                    description: 'Patient marked as done',
                                    duration: 3000,
                                });
                                typeof window !== 'undefined' && window.location.reload();
                            } else {
                                toast({
                                    title: 'Error',
                                    description: 'Error',
                                    variant: 'destructive',
                                    duration: 3000,
                                });
                            }
                        })
                    }} className="w-full">
                            ✅ Mark Done
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}