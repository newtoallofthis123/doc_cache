"use client"

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
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {backend} from "@/constants";

export default function DeletePatient({p_id, token}: { p_id: string, token: string }) {
    const {toast} = useToast();
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
                        onClick={async () => {
                            const res = await fetch(backend + '/delete/' + p_id, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token
                                }
                            })
                            const data = await res.json();
                            if (data.status == 'Patient Deleted') {
                                typeof window !== 'undefined' && window.location.replace('/')
                            } else {
                                toast({
                                    title: 'Error',
                                    description: 'Something went wrong. Please try again.',
                                    variant: 'destructive'
                                })
                            }
                        }}
                    >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}