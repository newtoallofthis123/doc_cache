import {cookies} from "next/headers";

export default async function Auth() {
    const jwt_token = cookies().get('token')?.value;
    if (!jwt_token) {
        return false
    }
    else{
        let auth_res = await fetch('http://localhost:2468/auth/', {
            method: 'GET',
            headers: {
                'Authorization': String(jwt_token)
            }
        }
        )
        return auth_res.status === 200;
    }
}