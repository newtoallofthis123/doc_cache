import React from "react";
import Image from "next/image";

export default function Landing(){
    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-center">
                <div className="w-3/5 pl-2">
                    <div className="text-xl">
                        <h1 className="text-5xl font-heading font-bold pt-6 py-2">
                            Hospital Management
                        </h1>
                        <p className="text-2xl py-2">Done right.</p>
                    </div>
                </div>
                <div className="w-2/5">
                    <Image
                        width="162"
                        height="162"
                        className="w-full"
                        src="/okay.svg"
                        alt="NoobScience Logo"
                    />
                </div>
            </div>
        </div>
    )
}