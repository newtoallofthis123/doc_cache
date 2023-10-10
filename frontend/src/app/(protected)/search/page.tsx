import CreateTable from "@/components/base/table";
import {cookies} from "next/headers";

export default function Page() {
    const token = cookies().get('token')?.value as string;
    return (
        <div className="flex flex-col justify-center items-center py-10">
            <CreateTable token={token} query={''} />
        </div>
    )
}