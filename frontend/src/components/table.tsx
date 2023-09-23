import React from "react";
import {Input} from "@/components/ui/input.tsx";

async function search_patients(term: string) {
    const url = `/api/search/${term}`;
    const response = await fetch(url);
    return await response.json();
}

export default function CreateTable({ query, default_term, small, number}: { query: string, default_term: string, small:boolean, number:number}) {
    const [search, setSearch] = React.useState(query);
    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        search_patients(search).then((data) => {
            setResults(data);
        }
        );
    }, [search]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let {value} = e.target;
        if(value == undefined) {
            return;
        }
        if (value == '') {
            setResults([]);
            setSearch(default_term);
            return;
        }

        if (value.length < 3) {
            setSearch(value);
            return;
        }
        setSearch(value);
        const data = await search_patients(search);
        if (data.length != 0) {
            setResults(data);
        }
    }

    return (
        <div className={`${small?('w-full'):('w-5/6')}`}>
            <div className="my-3 flex flex-row justify-between items-center">
                {
                    small?(
                        <h1 className="text-xl font-heading font-bold p-1 ml-2">Recent Records</h1>
                        ):(
                        <h1 className="text-2xl font-bold p-1 ml-2">Results for "{search}" in the 🏥</h1>
                    )
                }
                <div className="flex flex-row w-3/5 border-black border-2 rounded-2xl">
                    <Input onChange={handleChange} type="search" placeholder="Start typing to search" className="border-0 focus-visible:ring-0 focus-visible:outline-none" />
                    <button className="px-3">🔍</button>
                </div>
            </div>
            <div className="border-2 border-neutral-800 rounded-lg pt-0">
                <table className="w-full">
                    <thead className="rounded-lg">
                    <tr className={`rounded-t-lg text-white bg-black ${small?('text-lg'):('text-xl')}`}>
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
                    {results.length != 0 && results.slice(0, number).map((patient: any) => (
                        <tr
                            key={patient.p_id}
                            onClick={() => {
                                typeof window !== "undefined" && (window.location.href = `/patients/${patient.p_id}`);
                            }
                            }
                            className="border-b-2 rounded-lg border-neutral-800 text-lg cursor-pointer hover:bg-neutral-200"
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
                                doc <a href={"/doctors/" + patient["doc_id"]} className="underline">#{patient["doc_id"]}</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
