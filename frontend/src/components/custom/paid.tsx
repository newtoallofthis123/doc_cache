'use client'

import React from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {backend} from "@/constants";
import {Patient} from "@/types";
import {useToast} from "@/components/ui/use-toast";

export default function Payment({token, patient}:{token: string, patient: Patient}) {
    const [paid, setPaid] = React.useState(patient.paid);
    const {toast} = useToast();
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-xl px-3 py-6 w-4/5">💵 Mark Paid</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>✅ Mark Payment</DialogTitle>
                        <DialogDescription>
                            Ensure you collect the full amount from the patient.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid grid-y-3'>
                        <p>
                            <span className="font-bold">Name: </span> {patient.full_name}
                        </p>
                        <p>
                            <span className="font-bold">Last Visit:</span> {new Date(patient.created_at).toDateString()}
                        </p>
                        <p>
                            <span className="font-bold">Amount Due:</span> ₹{patient.payment}
                        </p>
                    </div>
                    <DialogFooter>
                        {
                            paid ? (
                                <div>
                                    <p>Payment Marked</p>
                                </div>
                            ):(
                                <Button onClick={() => {
                                    fetch(backend + '/paid/' + patient.p_id, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': token
                                        }
                                    })
                                        .then(() => {
                                            toast({
                                                title: 'Success',
                                                description: 'Payment Marked',
                                            })
                                        setPaid(true)
                                    }).catch(
                                        (err) => {
                                            toast({
                                                title: 'Error',
                                                description: 'Something went wrong. Please try again.',
                                                variant: 'destructive'
                                            })
                                            console.log(err);
                                        }
                                    )
                                }}>Done</Button>
                            )
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}