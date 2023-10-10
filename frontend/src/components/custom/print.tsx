'use client'

import { Doctor, Patient } from '@/types';
import { jsPDF } from 'jspdf';
import { Button } from '../ui/button';

export default function Print({ patient, doctor }: { patient: Patient, doctor: Doctor }) {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Patient Receipt", 105, 10, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let pos = 20;
    doc.text("Patient ID: " + patient.p_id, 10, pos);
    doc.text("Name: " + patient.full_name, 10, pos + 10);
    doc.text("Age: " + patient.age, 10, pos + 20);
    doc.text("Gender: " + patient.gender, 10, pos + 30);
    doc.text("Treated By: " + doctor.full_name + " #" + patient.doc_id, 10, pos+40);
    doc.text("Description: ", 10, pos + 50);
    doc.text("Problems: ", 10, pos + 60);
    pos = pos + 70;
    patient.problems.split(";").forEach((problem, i) => {
        doc.text(i + 1 + ". " + problem, 20, pos + i * 10);
        pos = pos + i * 10;
    });
    doc.text("Diagnosis: " + patient.diagnosis, 10, pos + 10);
    doc.text("Medicines: ", 10, pos + 20);
    pos = pos + 30;
    patient.medicines.split(";").forEach((medicine, i) => {
        doc.text(i + 1 + ". " + medicine, 20, pos + i * 10);
        pos = pos + i * 10;
    });
    pos = pos + 10;
    doc.text('Phone: ' + patient.phone, 10, pos);
    doc.text("Date: " + new Date(patient.created_at).toDateString(), 10, pos + 10);
    doc.text("Payment: " + patient.payment + " | Paid", 10, pos + 20);
    doc.text("Signature: <DIGITALIZED/REDACTED>", 10, pos + 40);
    return (
        <div>
            <Button onClick={() => doc.save("patient_" + patient.p_id + ".pdf")} className="text-xl px-3 py-6 w-4/5">
                🖨️ Print Receipt
            </Button>
        </div>
    );
}