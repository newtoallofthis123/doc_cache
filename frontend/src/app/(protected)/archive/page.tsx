import CreateTable from "@/components/base/table";
import {cookies} from "next/headers";

export default function Archive(){
    return (
        <div className='flex flex-col items-center justify-center'>
            <CreateTable token={cookies().get('token')?.value as string} query='all' default_term='all' small={false} />
        </div>
    )
}