'use client'
import React from 'react';
import Auth from '@/auth';

type Props = {};


export default function LoginPage({ }: Props) {
    typeof window !== 'undefined' && document.cookie.includes('token') && window.location.replace('/')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const doc_id = e.currentTarget.doc_id.value;
        const password = e.currentTarget.password.value;
        await fetch('http://localhost:2468/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                doc_id: parseInt(doc_id),
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.token != "") {
                    typeof window !== 'undefined' && (
                        document.cookie = `token=${data.token}; path=/;`
                    )
                    typeof window !== 'undefined' && (
                        window.location.href = '/'
                    )
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <div className="flex flex-col justify-center">
                <form onSubmit={handleSubmit}>
                    <div className="w-3/5">
                        <input
                            type="text"
                            placeholder="Docter ID"
                            name="doc_id"
                            id="username"
                            className="border-2 border-black rounded-lg p-1"
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            name="password"
                            id="password"
                            className="border-2 border-black rounded-lg p-1"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white rounded-lg p-1"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
