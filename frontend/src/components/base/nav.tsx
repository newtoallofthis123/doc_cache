import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ModeToggle } from '@/components/custom/theme';
import React from 'react';
import { PersonIcon } from '@radix-ui/react-icons';

export default function Nav({ auth = false }) {
    async function search(formData: FormData) {
        'use server';

        const query = formData.get('query') as string;
        redirect('/search/' + query);
    }
    async function logout(formData: FormData) {
        'use server';

        cookies().delete('token');
    }

    return (
        <>
            <nav>
                <div
                    style={{
                        boxShadow: '0 0 2px 2px #797979',
                    }}
                    className="flex flex-row justify-between items-center p-3"
                >
                    <div className="flex-shrink-0 flex flex-row justify-around">
                        <Image
                            width={96}
                            height={96}
                            className="w-10 h-10 md:w-10 md:h-10"
                            src="/favicon.svg"
                            alt="DocCache Logo"
                        />
                        <h1 className="text-2xl font-bold p-1 ml-2">
                            {!auth && <a href="/">DocCache</a>}
                            {auth && <a href="/dashboard">DocCache</a>}
                        </h1>
                    </div>
                    <div className="gap-x-10">
                        <ul className="gap-x-8 flex flex-row">
                            {[
                                'doctors',
                                'dashboard',
                                'payments',
                                'archive',
                                'add',
                                'today',
                            ].map((link) => {
                                return (
                                    <li className="text-lg" key={link}>
                                        <a href={'/' + link}>
                                            {link.slice(0, 1).toUpperCase() +
                                                link.slice(1)}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <form
                        action={search}
                        className="flex flex-row border-2 w-96 border-neutral-400 rounded-3xl drop-shadow-lg"
                    >
                        <Input
                            type="search"
                            autoComplete="off"
                            spellCheck="false"
                            name="query"
                            required={true}
                            className="border-0 focus-visible:outline-none focus-visible:ring-0"
                            placeholder="Search"
                        />
                        <Button
                            className="bg-inherit border-0 shadow-none text-black text-xl hover:bg-inherit"
                            type="submit"
                        >
                            🔍
                        </Button>
                    </form>
                    <ModeToggle />
                    <div className="flex flex-row justify-between items-center gap-x-5">
                        <Button className="text-lg px-2 py-5">
                            <Link
                                href="/manage"
                                className="flex flex-row items-center justify-between gap-x-2"
                            >
                                <PersonIcon /> Manage
                            </Link>
                        </Button>
                        {auth ? (
                            <form action={logout}>
                                <Button
                                    variant="outline"
                                    className="text-lg px-2 py-5"
                                >
                                    Logout
                                </Button>
                            </form>
                        ) : (
                            <Button
                                variant="outline"
                                className="text-lg px-2 py-5"
                            >
                                <Link href="/auth/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
