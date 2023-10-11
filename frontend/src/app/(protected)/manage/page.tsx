import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

type Props = {}

export default function AccountRedirect({}: Props) {
    const doc_id = cookies().get('doc_id')?.value as string;
    redirect('/manage/' + doc_id);
}