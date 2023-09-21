import Auth from '@/auth';
import Nav from '@/components/nav';
import React from 'react';
import { redirect } from 'next/navigation';

type Props = {
    children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
    const auth = Auth();
    if (!auth) {
        return redirect('/auth');
    }
    return (
        <div>
            <Nav />
            {children}
        </div>
    );
}
