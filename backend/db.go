package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type Store interface {
	Init() error
	CreateDoctor(doc CreateDoctorRequest) error
	GetDoctor(docId int) (Doctor, error)
	CreatePatient(patient CreatePatientRequest) error
	GetPatient(pId string) (Patient, error)
	GetDocPassword(docId int) (string, error)
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

	patientsQuery := `
	CREATE TABLE IF NOT EXISTS patients (
		id SERIAL PRIMARY KEY,
		full_name TEXT NOT NULL,
		age INT NOT NULL,
		gender TEXT,
		p_id TEXT NOT NULL,
		problems TEXT NOT NULL,
		diagnosis TEXT NOT NULL,
		description TEXT,
		phone TEXT NOT NULL,
		medicines TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		doc_id INT REFERENCES doctors(doc_id)
	);
	`

	_, err = pq.Db.Exec(patientsQuery)
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
	if err != nil {
		return false
	}
	return true
}

// CreatePatient Accepts a CreatePatientRequest struct and creates a new patient
func (pq *DBInstance) CreatePatient(patient CreatePatientRequest) error {
	pId := RanHash()
	query := `
	INSERT INTO patients (full_name, age, gender, p_id, problems, diagnosis, description, phone, medicines, doc_id) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`

	// Check if the doctor exists using the doc_id
	if !pq.doesDoctorExist(patient.DocId) {
		return fmt.Errorf("doctor with id %d doesn't exist", patient.DocId)
	}

	_, err := pq.Db.Exec(query, patient.FullName, patient.Age, patient.Gender, pId, patient.Problems, patient.Diagnosis, patient.Description, patient.Phone, patient.Medicines, patient.DocId)
	return err
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

	err := row.Scan(&id, &patient.FullName, &patient.Age, &patient.Gender, &patient.PId, &patient.Problems, &patient.Diagnosis, &patient.Description, &patient.Phone, &patient.Medicines, &patient.CreatedAt, &patient.DocId)
	if err != nil {
		return Patient{}, err
	}
	return patient, nil
}
