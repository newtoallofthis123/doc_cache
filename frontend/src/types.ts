export type Patient = {
    p_id: string;
    full_name: string;
    age: number;
    gender: string;
    problems: string;
    diagnosis: string;
    description: string;
    phone: string;
    medicines: string;
    paid: boolean;
    payment: number;
    next_appointment: string;
    created_at: string;
    doc_id: number;
}

export type Doctor = {
    doc_id: number;
    full_name: string;
    gov_id: string;
    created_at: string;
    password: string;
}

export type CreatePatient = {
    full_name: string;
    age: number;
    gender: string;
    problems: string;
    diagnosis: string;
    description: string;
    phone: string;
    medicines: string;
    payment: number;
    doc_id: number;
}