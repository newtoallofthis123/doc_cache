'use client'

import React from "react";
import {Input} from "@/components/ui/input";
import {backend} from "@/constants";
import {Patient} from "@/types";
import {cookies} from "next/headers";
import Link from "next/link";

async function search_patients(term: string, token: string) {
    const url = backend + '/search?q=' + term;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    return await response.json();
}

export default function CreateTable({title = '', initial = [], query, default_term, small, token, number}: {
    title?: string,
    initial?: any,
    query: string,
    default_term?: string,
    token: string,
    small?: boolean,
    number?: number
}) {
    const [search, setSearch] = React.useState(query);
    const [results, setResults] = React.useState(initial);

    React.useEffect(() => {
        if (search == 'display') {
            return;
        }
        search_patients(search, token).then((data) => {
                setResults(data);
            }
        );
    }, [search]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let {value} = e.target;
        if (value == undefined) {
            return;
        }
        if (value == '') {
            setResults(initial);
            if (default_term != '') {
                setSearch(default_term || 'all');
            }
            return;
        }

        if (value.length < 3) {
            setSearch(value);
            return;
        }
        setSearch(value);
        const data = await search_patients(search, token);
        if (data === null) {
            setResults(data);
        }
    }

    return (
        <div className={`${small ? ('w-full') : ('w-5/6')}`}>
            <div className="my-3 flex flex-row justify-between items-center">
                {
                    small ? (
                        <h1 className="text-xl font-heading font-bold p-1 ml-2">Recent Records</h1>
                    ) : (
                        <h1 className="text-2xl font-bold p-1 ml-2">{
                            (title != '') ? (title) : (`Results for "${search}" in the 🏥`)
                        }</h1>
                    )
                }
                <form onSubmit={(e) => {
                    e.preventDefault();
                    typeof window !== "undefined" && (window.location.href = `/patients/${results[0].p_id}`);
                }} className="flex flex-row w-3/5 border-black dark:border-neutral-100 border-2 rounded-2xl">
                    <Input onChange={handleChange} type="search" placeholder="Search for any patient in the database"
                           className="border-0 focus-visible:ring-0 focus-visible:outline-none"/>
                    <button className="px-3">🔍</button>
                </form>
            </div>
            <div className="border-2 border-neutral-800 dark:border-neutral-100 rounded-lg pt-0">
                <table className="w-full">
                    <thead className="rounded-lg">
                    <tr className={`rounded-t-lg text-white bg-black dark:bg-neutral-100 dark:text-black  ${small ? ('text-lg') : ('text-xl')}`}>
                        <th className="py-3 px-2 text-center">Name</th>
                        <th className="py-3 px-2 text-center">Age</th>
                        <th className="py-3 px-2 text-center">Problems</th>
                        {
                            !small && (
                                <th className="py-3 px-2 text-center">Diagnosis</th>
                            )
                        }
                        <th className="py-3 px-2 text-center">Doctor</th>
                    </tr>
                    </thead>
                    <tbody className="rounded-lg">
                    {results != null &&  results.slice(0, number).map((patient: Patient)=> (
                        <tr
                            key={patient.p_id}
                            onClick={() => {
                                typeof window !== "undefined" && (window.location.href = `/patients/${patient.p_id}`);
                            }
                            }
                            className="border-b-2 rounded-lg border-neutral-800 dark:border-neutral-100 text-lg cursor-pointer hover:bg-neutral-200 hover:dark:text-black"
                        >
                            <td className="p-2 font-bold text-center">
                                {patient.full_name}
                            </td>
                            <td className="p-2 text-center">
                                {patient.age} year old {patient.gender}
                            </td>
                            <td className="p-2 text-center">
                                {patient.problems.split(";").map((problem: string, index: number) => (
                                    <span key={problem}>
                    {problem}
                                        {index !== patient.problems.split(";").length - 1 && ", "}
                  </span>
                                ))}
                            </td>
                            {
                                !small && (
                                    <td className="px-2 py-3 text-center">
                                        {patient.diagnosis.split(";").map((diagnosis: string, index: number) => (
                                            <span key={diagnosis}>
                    {diagnosis}
                                                {index !== patient.diagnosis.split(";").length - 1 && ", "}
                  </span>
                                        ))}
                                    </td>
                                )
                            }
                            <td className="px-2 py-3 text-center">
                                doc <Link href={"/doctors/" + patient["doc_id"]}
                                       className="underline">#{patient["doc_id"]}</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}