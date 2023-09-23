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
export default function Payment({patient}:any) {
    const [paid, setPaid] = React.useState(patient.paid);
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
                        <div>
                            <p>
                                <span className="font-bold">Name: </span> {patient.full_name}
                            </p>
                            <p>
                                <span className="font-bold">Last Visit:</span> {new Date(patient.created_at).toDateString()}
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
                                    fetch(`/api/paid/${patient.p_id}`).then(() => {
                                        setPaid(true)
                                    }).catch(
                                        (err) => {
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