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
import { Button } from "@/components/ui/button"
import React from "react";

export default  function DeletePatient({patient}:any) {
    return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className="text-xl px-3 py-6 w-4/5">❌ Delete Entry</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>❗ Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the patient record.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                        fetch(`/api/delete/${patient.p_id}`).then(() => {
                            typeof window !== "undefined" && window.location.replace(`/dashboard`);
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
    )
    }
