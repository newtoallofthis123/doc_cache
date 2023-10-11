import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {backend} from "@/constants";

export default function Login() {
    async function login(formData: FormData) {
        'use server'

        const doc_id = parseInt(formData.get('doc_id') as string);
        const password = formData.get('password') as string;
        const res = await fetch(backend + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                doc_id: doc_id,
                password: password
            })
        })
        const data = await res.json();
        cookies().set('token', data.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true
        })
        cookies().set('doc_id', doc_id.toString(), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true
        })
        redirect('/');
    }

    return (
        <div className="flex flex-col items-center my-10">
            <div className="flex flex-col justify-center">
                <h1 className="text-5xl font-heading text-neutral-800 dark:text-neutral-50">
                    Welcome Back Doc! 🩺
                </h1>
                <p className="py-5 text-xl text-neutral-900 dark:text-neutral-200">
                    The World needs more heroes like you :)
                </p>
                <div>
                    <form action={login}>
                        <Input
                            type='number'
                            autoComplete='off'
                            name="doc_id"
                            placeholder="Enter Your Doc ID"
                            className="text-lg p-2 border-neutral-800 dark:border-neutral-100 mb-4"
                        />
                        <Input
                            type='password'
                            name="password"
                            placeholder="Your Secret Password"
                            className="text-lg p-2 border-neutral-800 dark:border-neutral-100 mt-2"
                        />
                        <Button className="text-xl p-5 border-neutral-800 dark:border-neutral-100 my-5">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}