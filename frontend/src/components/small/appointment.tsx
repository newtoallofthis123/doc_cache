import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Calendar} from "@/components/ui/calendar.tsx";
import { Button } from "@/components/ui/button"
import Toastify from "toastify-js";
import React from "react";

export default function Appointment({patient, token}:any) {
    const [next, setNext] = React.useState<Date | undefined>(new Date(patient.next_appointment))
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="text-xl px-3 py-6 w-4/5">🕛 Set Appointment</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Select an
                            <span className="font-bold"> Appointment Date</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Select a date for the next appointment from the calendar below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col justify-between'>
                        <Calendar fromDate={new Date(patient.created_at)} onSelect={setNext} initialFocus={true} selected={next} mode="single" />
                        <div className="pt-4">
                            Selected Date is {
                            //@ts-ignore
                            next.toDateString()
                        }
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                fetch(`/api/appointment`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        "p_id": patient.p_id,
                                        "next_appointment": next,
                                        "token": token
                                    }),
                                }).then(() => {
                                    typeof window !== "undefined" && window.location.reload();
                                }).catch(
                                    (err) => {
                                        console.log(err);
                                    }
                                )
                            }}
                        >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}