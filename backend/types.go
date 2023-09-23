package main

import "time"

type Env struct {
	DB        string
	Password  string
	User      string
	JwtSecret string
}

type CreateDoctorRequest struct {
	FullName string `json:"full_name"`
	GovId    string `json:"gov_id"`
	Password string `json:"password"`
}

type Doctor struct {
	DocId          int    `json:"doc_id"`
	FullName       string `json:"full_name"`
	GovId          string `json:"gov_id"`
	CreatedAt      string `json:"created_at"`
	HashedPassword string `json:"password"`
}

type CreatePatientRequest struct {
	FullName    string `json:"full_name"`
	Age         int    `json:"age"`
	Gender      string `json:"gender"`
	Problems    string `json:"problems"`
	Diagnosis   string `json:"diagnosis"`
	Description string `json:"description"`
	Phone       string `json:"phone"`
	Medicines   string `json:"medicines"`
	Payment     int    `json:"payment"`
	DocId       int    `json:"doc_id"`
}

type Patient struct {
	FullName        string    `json:"full_name"`
	Age             int       `json:"age"`
	Gender          string    `json:"gender"`
	PId             string    `json:"p_id"`
	Problems        string    `json:"problems"`
	Diagnosis       string    `json:"diagnosis"`
	Description     string    `json:"description"`
	Phone           string    `json:"phone"`
	Medicines       string    `json:"medicines"`
	Paid            bool      `json:"paid"`
	Payment         int       `json:"payment"`
	NextAppointment time.Time `json:"next_appointment"`
	DocId           int       `json:"doc_id"`
	CreatedAt       time.Time `json:"created_at"`
}

type DoctorLoginRequest struct {
	DocId    int    `json:"doc_id"`
	Password string `json:"password"`
}

type DoctorLoginResponse struct {
	Token  string `json:"token"`
	Number int    `json:"number"`
}

type EmpLoginRequest struct {
	EmpId    int    `json:"emp_id"`
	Password string `json:"password"`
}

type EmpLoginResponse struct {
	Token  string `json:"token"`
	Number int    `json:"number"`
}

type NextAppointmentRequest struct {
	PId             string    `json:"p_id"`
	NextAppointment time.Time `json:"next_appointment"`
}

type TransferPatientRequest struct {
	PId     string `json:"p_id"`
	ToDocId int    `json:"to_doc_id"`
}

type CreateEmpRequest struct {
	FullName string `json:"full_name"`
	Role     string `json:"role"`
	Password string `json:"password"`
}

type Emp struct {
	EmpId          int    `json:"emp_id"`
	FullName       string `json:"full_name"`
	Role           string `json:"role"`
	CreatedAt      string `json:"created_at"`
	HashedPassword string `json:"password"`
}

type PendingRequest struct {
	PId   string `json:"p_id"`
	DocId int    `json:"doc_id"`
}

type TransactionRequest struct {
	EmpId  int    `json:"emp_id"`
	Reason string `json:"reason"`
	Amount int    `json:"amount"`
	Flow   bool   `json:"flow"`
}

type Transaction struct {
	TransactionId int       `json:"tranc_id "`
	EmpId         int       `json:"emp_id"`
	Reason        string    `json:"reason"`
	Amount        int       `json:"amount"`
	Flow          bool      `json:"flow"`
	CreatedAt     time.Time `json:"created_at"`
}
