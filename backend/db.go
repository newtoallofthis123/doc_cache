package main

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "github.com/lib/pq"
)

type Store interface {
	Init() error

	// Doctors
	CreateDoctor(doc CreateDoctorRequest) error
	GetDoctor(docId int) (Doctor, error)
	GetDocPassword(docId int) (string, error)

	// Employees
	CreateEmp(emp CreateEmpRequest) error
	GetEmp(empId int) (Emp, error)
	GetEmpPassword(empId int) (string, error)
	DeleteEmp(empID int) error

	// Patients
	CreatePatient(patient CreatePatientRequest) (string, error)
	GetPatient(pId string) (Patient, error)
	GetAllPatients() ([]Patient, error)
	SearchPatient(query string) ([]Patient, error)
	DeletePatient(pId string) error
	UpdatePatient(pId string, patient Patient) error

	// Pending
	CreatePending(pId string, docId int) error
	DeletePending(pId string) error
	GetPending(docId int) ([]Patient, error)

	// Transactions
	CreateTransaction(transaction TransactionRequest) error
	GetTransaction(t_id int) (Transaction, error)
	GetAllTransactions() ([]Transaction, error)
}

type DBInstance struct {
	Db *sql.DB
}

// NewDBInstance Function that creates a new DBInstance
func NewDBInstance() (*DBInstance, error) {
	env := GetEnv()
	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=localhost port=5432 sslmode=disable", env.User, env.DB, env.Password)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return &DBInstance{db}, nil
}

// Private Function that creates a table if it doesn't exist
func (pq *DBInstance) createTable() error {
	doctorsQuery := `
	CREATE TABLE IF NOT EXISTS doctors (
		doc_id SERIAL PRIMARY KEY,
		full_name TEXT NOT NULL,
		gov_id TEXT NOT NULL,
		password TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW()
	);
	`

	_, err := pq.Db.Exec(doctorsQuery)
	if err != nil {
		return err
	}

	employeesQuery := `
	CREATE TABLE IF NOT EXISTS employees (
			emp_id SERIAL PRIMARY KEY,
			full_name TEXT NOT NULL,
			role TEXT NOT NULL,
			password TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT NOW()
	    );
	`

	_, err = pq.Db.Exec(employeesQuery)
	if err != nil {
		return err
	}

	patientsQuery := `
	CREATE TABLE IF NOT EXISTS patients (
		id SERIAL,
		full_name TEXT NOT NULL,
		age INT NOT NULL,
		gender TEXT,
		p_id TEXT UNIQUE PRIMARY KEY NOT NULL,
		problems TEXT NOT NULL,
		diagnosis TEXT NOT NULL,
		description TEXT,
		phone TEXT NOT NULL,
		medicines TEXT NOT NULL,
		paid BOOLEAN DEFAULT FALSE,
		payment INT NOT NULL,
		next_appointment TIMESTAMP DEFAULT INTERVAL '2 week' + NOW(),
		created_at TIMESTAMP DEFAULT NOW(),
		doc_id INT REFERENCES doctors(doc_id)
	);
	`

	_, err = pq.Db.Exec(patientsQuery)
	if err != nil {
		return err
	}

	pendingQuery := `
	CREATE TABLE IF NOT EXISTS pending (
	    		id SERIAL PRIMARY KEY,
	    		p_id TEXT REFERENCES patients(p_id),
	    		doc_id INT REFERENCES doctors(doc_id),
	    		created_at TIMESTAMP DEFAULT NOW()
	    );
	`

	_, err = pq.Db.Exec(pendingQuery)
	if err != nil {
		return err
	}

	financesQuery := `
	CREATE TABLE IF NOT EXISTS finances (
	    		transaction_id SERIAL PRIMARY KEY,
	    		emp_id INT REFERENCES employees(emp_id),
	    		reason TEXT NOT NULL,
	    		flow BOOLEAN NOT NULL,
	    		amount INT NOT NULL,
	    		created_at TIMESTAMP DEFAULT NOW()
	    );
	`

	_, err = pq.Db.Exec(financesQuery)
	if err != nil {
		return err
	}

	return nil
}

//# Start of The Interface Implementation

// Init Function that inits the DBInstance
func (pq *DBInstance) Init() error {
	err := pq.createTable()
	return err
}

// CreateDoctor Accepts a CreateDoctorRequest struct and creates a new doctor
func (pq *DBInstance) CreateDoctor(doc CreateDoctorRequest) error {
	query := `
	INSERT INTO doctors (full_name, gov_id, password)
	VALUES ($1, $2, $3)
	`

	hashedPassword, err := HashPassword(doc.Password)
	if err != nil {
		return err
	}

	_, err = pq.Db.Exec(query, doc.FullName, doc.GovId, hashedPassword)
	return err
}

// GetDoctor Accepts a docId and returns a Doctor struct
func (pq DBInstance) GetDoctor(docId int) (Doctor, error) {
	query := `
	SELECT * FROM doctors WHERE doc_id = $1
	`

	row := pq.Db.QueryRow(query, docId)
	var doc Doctor

	// I want to ignore the password field
	// So the easiest way is to create a variable that will hold the password
	// and then ignore it
	hashedPassword := ""

	err := row.Scan(&doc.DocId, &doc.FullName, &doc.GovId, &hashedPassword, &doc.CreatedAt)
	if err != nil {
		return Doctor{}, err
	}
	return doc, nil
}

func (pq *DBInstance) GetDocPassword(docId int) (string, error) {
	query := `
	SELECT password FROM doctors WHERE doc_id = $1
	`

	row := pq.Db.QueryRow(query, docId)
	var hashedPassword string

	err := row.Scan(&hashedPassword)
	if err != nil {
		return "", err
	}
	return hashedPassword, nil
}

// A small help function that checks if a doctor exists
func (pq *DBInstance) doesDoctorExist(docId int) bool {
	_, err := pq.GetDoctor(docId)
	return err == nil
}

// CreatePatient Accepts a CreatePatientRequest struct and creates a new patient
func (pq *DBInstance) CreatePatient(patient CreatePatientRequest) (string, error) {
	pId := RanHash()
	query := `
	INSERT INTO patients (full_name, age, gender, p_id, problems, diagnosis, description, phone, medicines, payment, doc_id) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`

	// Check if the doctor exists using the doc_id
	if !pq.doesDoctorExist(patient.DocId) {
		return "", fmt.Errorf("doctor with id %d doesn't exist", patient.DocId)
	}

	_, err := pq.Db.Exec(query, patient.FullName, patient.Age, patient.Gender, pId, patient.Problems, patient.Diagnosis, patient.Description, patient.Phone, patient.Medicines, patient.Payment, patient.DocId)
	if err != nil {
		return "", err
	}
	return pId, nil
}

// GetPatient Accepts a p_id and returns a Patient struct
func (pq *DBInstance) GetPatient(pId string) (Patient, error) {
	query := `
	SELECT * FROM patients WHERE p_id = $1
	`

	row := pq.Db.QueryRow(query, pId)
	var patient Patient

	// Some unused variables
	var id int

	err := row.Scan(&id, &patient.FullName, &patient.Age, &patient.Gender, &patient.PId, &patient.Problems, &patient.Diagnosis, &patient.Description, &patient.Phone, &patient.Medicines, &patient.Paid, &patient.Payment, &patient.NextAppointment, &patient.CreatedAt, &patient.DocId)
	if err != nil {
		return Patient{}, err
	}
	return patient, nil
}

func (pq *DBInstance) GetAllPatients() ([]Patient, error) {
	query := `
	SELECT * from patients;
	`

	rows, err := pq.Db.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var patients []Patient

	for rows.Next() {
		var patient Patient
		var id int

		err := rows.Scan(&id, &patient.FullName, &patient.Age, &patient.Gender, &patient.PId, &patient.Problems, &patient.Diagnosis, &patient.Description, &patient.Phone, &patient.Medicines, &patient.Paid, &patient.Payment, &patient.NextAppointment, &patient.CreatedAt, &patient.DocId)
		if err != nil {
			return nil, err
		}
		patients = append(patients, patient)
	}
	defer rows.Close()

	return patients, nil
}

func (pq *DBInstance) SearchPatient(query string) ([]Patient, error) {
	query = strings.ToLower(query)
	patients, err := pq.GetAllPatients()
	if err != nil {
		return nil, err
	}

	// convert every patient to a string
	// and then check if the query is in the string
	// if it is then append it to the results
	// and return the results
	var results []Patient

	for _, patient := range patients {
		patientString := fmt.Sprintf("%v", patient)
		//remove all the -, :, _ and lowercase the string
		patientString = strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(patientString, "-", ""), ":", ""), "{", ""))
		if strings.Contains(patientString, query) {
			results = append(results, patient)
		}
	}

	return results, nil
}

func (pq *DBInstance) DeletePatient(pId string) error {
	_, err := pq.GetPatient(pId)
	if err != nil {
		return err
	}

	query := `
	DELETE FROM patients WHERE p_id = $1
	`

	_, err = pq.Db.Exec(query, pId)
	return err
}

func (pq *DBInstance) UpdatePatient(pId string, patient Patient) error {
	_, err := pq.GetPatient(pId)
	if err != nil {
		return err
	}

	// SQL to update the patient
	query := `
		UPDATE patients
		SET 
		    full_name=$1,
		    age=$2,
		    gender=$3,
		    problems=$4,
		    diagnosis=$5,
		    description=$6,
		    phone=$7,
		    medicines=$8,
		    paid=$9,
		    payment=$10,
		    next_appointment=$11,
		    doc_id=$12,
		    created_at=$13
		WHERE p_id=$14;
	`

	_, err = pq.Db.Exec(query, patient.FullName, patient.Age, patient.Gender, patient.Problems, patient.Diagnosis, patient.Description, patient.Phone, patient.Medicines, patient.Paid, patient.Payment, patient.NextAppointment, patient.DocId, patient.CreatedAt, pId)

	return err
}

func (pq *DBInstance) doesPatientExist(pId string) bool {
	_, err := pq.GetPatient(pId)
	return err == nil
}

func (pq *DBInstance) CreateEmp(emp CreateEmpRequest) error {
	query := `
	INSERT INTO employees (full_name, role, password)
	VALUES ($1, $2, $3)
	`

	hashedPassword, err := HashPassword(emp.Password)
	if err != nil {
		return err
	}

	_, err = pq.Db.Exec(query, emp.FullName, emp.Role, hashedPassword)
	return err
}

func (pq *DBInstance) DeleteEmp(empID int) error {
	if !pq.doesEmployeeExist(empID) {
		return fmt.Errorf("employee with id %d doesn't exist", empID)
	}

	query := `
	DELETE FROM employees WHERE emp_id = $1
	`

	_, err := pq.Db.Exec(query, empID)
	return err
}

// GetEmp Accepts a docId and returns a Doctor struct
func (pq DBInstance) GetEmp(empId int) (Emp, error) {
	query := `
	SELECT * FROM employees WHERE emp_id = $1
	`

	row := pq.Db.QueryRow(query, empId)
	var emp Emp

	// Same as the doctor struct
	hashedPassword := ""

	err := row.Scan(&emp.EmpId, &emp.FullName, &emp.Role, &hashedPassword, &emp.CreatedAt)
	if err != nil {
		return Emp{}, err
	}
	return emp, nil
}

func (pq *DBInstance) GetEmpPassword(empId int) (string, error) {
	query := `
	SELECT password FROM employees WHERE emp_id = $1
	`

	row := pq.Db.QueryRow(query, empId)
	var hashedPassword string

	err := row.Scan(&hashedPassword)
	if err != nil {
		return "", err
	}
	return hashedPassword, nil
}

// A small help function that checks if a doctor exists
func (pq *DBInstance) doesEmployeeExist(empId int) bool {
	_, err := pq.GetEmp(empId)
	return err == nil
}

// CreatePending Accepts a p_id and doc_id and creates a new pending
func (pq *DBInstance) CreatePending(pId string, docId int) error {
	if !pq.doesPatientExist(pId) {
		return fmt.Errorf("patient with id %s doesn't exist", pId)
	}

	if !pq.doesDoctorExist(docId) {
		return fmt.Errorf("doctor with id %d doesn't exist", docId)
	}

	query := `
	INSERT INTO pending (p_id, doc_id)
	VALUES ($1, $2)
	`

	_, err := pq.Db.Exec(query, pId, docId)
	return err
}

// DeletePending Accepts a p_id and deletes the pending
func (pq *DBInstance) DeletePending(pId string) error {
	query := `
	DELETE FROM pending WHERE p_id = $1
	`

	_, err := pq.Db.Exec(query, pId)
	return err
}

// GetPending Get the pending requests for a doctor
func (pq *DBInstance) GetPending(docId int) ([]Patient, error) {
	if !pq.doesDoctorExist(docId) {
		return nil, fmt.Errorf("doctor with id %d doesn't exist", docId)
	}

	query := `
	SELECT * FROM pending WHERE doc_id = $1
	`

	rows, err := pq.Db.Query(query, docId)
	if err != nil {
		return nil, err
	}

	var pendingPatients []Patient

	for rows.Next() {
		// Well I only need the p_id
		// But I need to scan the other fields as well
		var pId string
		var docId int
		var id int
		var createdAt string

		err := rows.Scan(&id, &pId, &docId, &createdAt)

		if err != nil {
			return nil, err
		}

		patient, err := pq.GetPatient(pId)
		if err != nil {
			return nil, err
		}

		pendingPatients = append(pendingPatients, patient)
	}
	defer rows.Close()

	return pendingPatients, nil
}

func (pq *DBInstance) CreateTransaction(transaction TransactionRequest) error {
	if !pq.doesEmployeeExist(transaction.EmpId) {
		return fmt.Errorf("employee with id %d doesn't exist", transaction.EmpId)
	}

	query := `
	INSERT INTO finances (emp_id, reason, flow, amount)
	VALUES ($1, $2, $3, $4)
	`

	_, err := pq.Db.Exec(query, transaction.EmpId, transaction.Reason, transaction.Flow, transaction.Amount)
	return err
}

func (pq *DBInstance) GetTransaction(t_id int) (Transaction, error) {
	query := `
	SELECT * FROM finances WHERE transaction_id = $1
	`

	row := pq.Db.QueryRow(query, t_id)
	var transaction Transaction

	err := row.Scan(&transaction.TransactionId, &transaction.EmpId, &transaction.Reason, &transaction.Flow, &transaction.Amount, &transaction.CreatedAt)
	if err != nil {
		return Transaction{}, err
	}

	return transaction, nil
}

func (pq *DBInstance) GetAllTransactions() ([]Transaction, error) {
	query := `
	SELECT * FROM finances
	`

	rows, err := pq.Db.Query(query)
	if err != nil {
		return nil, err
	}

	var transactions []Transaction

	for rows.Next() {
		var transaction Transaction
		var id int
		var createdAt string

		err := rows.Scan(&id, &transaction.EmpId, &transaction.Reason, &transaction.Flow, &transaction.Amount, &createdAt)
		if err != nil {
			return nil, err
		}

		transactions = append(transactions, transaction)
	}

	return transactions, nil
}
