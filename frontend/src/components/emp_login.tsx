import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { FormEvent } from 'react';

export default function EmpLogin() {
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const emp_id = parseInt(e.currentTarget.emp_id.value);
        const password = e.currentTarget.password.value;
        await fetch('http://localhost:2468/emp/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emp_id: emp_id,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.token != '') {
                    typeof window !== 'undefined' &&
                        (document.cookie = `token=${data.token}; path=/;`);
                    typeof window !== 'undefined' &&
                        (document.cookie = `emp=${data.number}; path=/;`);
                    typeof window !== 'undefined' &&
                    (document.cookie = `type=emp; path=/;`);
                    typeof window !== 'undefined' &&
                        (window.location.href = '/');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Input
                    type='number'
                    autoComplete='off'
                    name="emp_id"
                    placeholder="Enter Your Emp ID"
                    className="text-lg p-2 border-neutral-800 mb-4"
                />
                <Input
                    type='password'
                    name="password"
                    placeholder="Your Secret Password"
                    className="text-lg p-2 border-neutral-800 mt-2"
                />
                <Button className="text-xl p-5 border-neutral-800 my-5">
                    Login
                </Button>
            </form>
        </>
    );
}
