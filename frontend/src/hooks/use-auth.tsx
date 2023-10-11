import {cookies} from "next/headers";
import {backend} from "@/constants";

export default async function useAuth() {
    const token = cookies().get('token')?.value || '';
    // request to backend
    const res = await fetch(backend + '/auth', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    const data = await res.json();
    return data === "Authorized";
}