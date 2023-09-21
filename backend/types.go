package main

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
	DocId       int    `json:"doc_id"`
}

type Patient struct {
	FullName    string `json:"full_name"`
	Age         int    `json:"age"`
	Gender      string `json:"gender"`
	PId         string `json:"p_id"`
	Problems    string `json:"problems"`
	Diagnosis   string `json:"diagnosis"`
	Description string `json:"description"`
	Phone       string `json:"phone"`
	Medicines   string `json:"medicines"`
	DocId       int    `json:"doc_id"`
	CreatedAt   string `json:"created_at"`
}

type DoctorLoginRequest struct {
	DocId    int    `json:"doc_id"`
	Password string `json:"password"`
}

type DoctorLoginResponse struct {
	Token  string `json:"token"`
	Number int    `json:"number"`
}
