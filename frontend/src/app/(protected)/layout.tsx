import React from "react";
import useAuth from "@/hooks/use-auth";
import {redirect} from "next/navigation";

export default async function RootLayout({children}: {
    children: React.ReactNode
}) {
    const auth = await useAuth();
    if(!auth){
        return redirect('/auth/login');
    }
    return (
        <>
            {children}
        </>
    )
}
