import React from 'react';
import Image from 'next/image';

type Props = {};

async function check_api() {
    const res = await fetch('http://localhost:2468/');
    const data = await res.json();
    return data;
}

export default async function Landing({}: Props) {
    return (
        <>
            <div className="p-4">
                <div className="flex flex-col md:flex-row justify-center">
                    <div className="w-3/5 pl-2">
                        <div className="text-xl">
                            <h1 className="text-7xl font-bold py-4">
                                Hospital Management
                            </h1>
                            <p className="text-xl py-2">Done right.</p>
                            <p>
                                Using old and outdated software to manage your
                                hospital? It is
                            </p>
                            <div className="leading-10">
                                <h2 className="text-5xl font-bold py-8">
                                    Time to get an upgrade
                                </h2>
                                <button className="bg-black rounded-xl my5 text-white py-2 px-5">
                                    Get Started
                                </button>
                            </div>
                            {await check_api()}
                        </div>
                    </div>
                    <div className="w-2/5">
                        <Image
                            width={162}
                            height={162}
                            className="w-full"
                            src="okay.svg"
                            alt="NoobScience Logo"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
