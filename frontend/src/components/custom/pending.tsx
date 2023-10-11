'use client';

import { Patient } from '@/types';
import React from 'react';
import { Button } from '../ui/button';
import { backend } from '@/constants';
import { useToast } from '../ui/use-toast';

type Props = {
    patient: Patient;
    token: string;
};

export default function PatientPending({patient, token}: Props) {
    const { toast } = useToast();
    return (
        <div>
            <Button
                onClick={() => {
                    fetch(backend + '/complete', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                        body: JSON.stringify({
                            p_id: patient.p_id,
                            //@ts-ignore
                            doc_id: parseInt(patient.doc_id),
                        }),
                    }).then((res) => {
                        if (res.status == 200) {
                            toast({
                                title: 'Patient marked as done',
                                description: 'Patient marked as done',
                                duration: 3000,
                            });
                            typeof window !== 'undefined' &&
                                window.location.reload();
                        } else {
                            toast({
                                title: 'Error',
                                description: 'Error',
                                variant: 'destructive',
                                duration: 3000,
                            });
                        }
                    });
                }}
                className="text-xl px-3 py-6 w-4/5"
            >
                ✅ Mark Done
            </Button>
        </div>
    );
}
