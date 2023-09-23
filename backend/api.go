package main

import (
	"log"
	"strconv"

	jwt "github.com/golang-jwt/jwt/v4"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

type ApiServer struct {
	listenAddr string
	store      Store
}

func NewApiServer(listenAddr string, store Store) *ApiServer {
	return &ApiServer{
		listenAddr: listenAddr,
		store:      store,
	}
}

func (api *ApiServer) handleHello(c *gin.Context) {
	log.Println("API Health Check: Status Ok(200)")
	c.JSON(200, "DocCache API v.0.1")
}

func (api *ApiServer) handleGetDoctor(c *gin.Context) {
	docId := c.Param("doc_id")
	docIdInt, err := strconv.Atoi(docId)
	if err != nil {
		log.Println("Error converting doc_id to int")
		c.JSON(400, err)
		return
	}
	doc, err := api.store.GetDoctor(docIdInt)
	if err != nil {
		log.Println("Error getting doctor from db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, doc)
}

func (api *ApiServer) handleGetPatient(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error Authenticating JWT")
		c.JSON(500, err)
		return
	}

	pId := c.Param("p_id")
	patient, err := api.store.GetPatient(pId)

	if err != nil {
		log.Println("Error getting patient from db")
		c.JSON(500, err)
		return
	}

	c.JSON(200, patient)
}

func (api *ApiServer) handleDoctorCreation(c *gin.Context) {
	var createDoctorRequest CreateDoctorRequest
	err := c.BindJSON(&createDoctorRequest)
	if err != nil {
		log.Println("Error binding json for doctor creation")
		c.JSON(400, err)
		return
	}
	err = api.store.CreateDoctor(createDoctorRequest)
	if err != nil {
		log.Println("Error creating doctor in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Doctor Created")
}

func (api *ApiServer) handleDoctorLogin(c *gin.Context) {
	var loginRequest DoctorLoginRequest
	err := c.BindJSON(&loginRequest)
	if err != nil {
		log.Println("Error binding json for doctor login")
		c.JSON(400, err)
		return
	}
	hashedPassword, err := api.store.GetDocPassword(loginRequest.DocId)
	if err != nil {
		log.Println("Error getting doctor password from db")
		c.JSON(500, err)
		return
	}
	if !MatchPasswords(loginRequest.Password, hashedPassword) {
		log.Println("Error matching passwords")
		c.JSON(401, "Unauthorized")
		return
	}

	token, err := CreateJWT(loginRequest.DocId)
	if err != nil {
		log.Println("Error creating JWT")
		c.JSON(500, err)
		return
	}
	c.SetCookie("token", token, 24*60*60, "/", "localhost", false, true)
	c.JSON(200, DoctorLoginResponse{
		Token:  token,
		Number: loginRequest.DocId,
	},
	)
}

func (api *ApiServer) handleAuth(c *gin.Context) {
	jwtToken := c.Request.Header.Get("Authorization")
	if jwtToken == "" {
		log.Println("Error getting JWT from header")
		c.JSON(401, "Unauthorized")
		return
	}
	token, err := ValidateJWT(jwtToken)
	if err != nil {
		log.Println("Error validating JWT")
		c.JSON(500, err)
		return
	}
	if !token.Valid {
		log.Println("Error validating JWT")
		c.JSON(401, "Unauthorized")
		return
	}
	c.JSON(200, "Authorized")
}

func (api *ApiServer) handleEmpCreation(c *gin.Context) {
	var createEmpRequest CreateEmpRequest
	err := c.BindJSON(&createEmpRequest)
	if err != nil {
		log.Println("Error binding json for employee creation")
		c.JSON(400, err)
		return
	}
	err = api.store.CreateEmp(createEmpRequest)
	if err != nil {
		log.Println("Error creating employee in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Employee Created")
}

func (api *ApiServer) handleEmpGet(c *gin.Context) {
	empId := c.Param("emp_id")
	empIdInt, err := strconv.Atoi(empId)
	if err != nil {
		log.Println("Error converting emp_id to int")
		c.JSON(400, err)
		return
	}
	emp, err := api.store.GetEmp(empIdInt)
	if err != nil {
		log.Println("Error getting emp from db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, emp)
}

func (api *ApiServer) handleEmpLogin(c *gin.Context) {
	var loginRequest EmpLoginRequest
	err := c.BindJSON(&loginRequest)
	if err != nil {
		log.Println("Error binding json for employee login")
		c.JSON(400, err)
		return
	}
	hashedPassword, err := api.store.GetEmpPassword(loginRequest.EmpId)
	if err != nil {
		log.Println("Error getting employee password from db")
		c.JSON(500, err)
		return
	}
	if !MatchPasswords(loginRequest.Password, hashedPassword) {
		log.Println("Error matching passwords")
		c.JSON(401, "Unauthorized")
		return
	}

	token, err := CreateJWT(loginRequest.EmpId)
	if err != nil {
		log.Println("Error creating JWT")
		c.JSON(500, err)
		return
	}
	c.SetCookie("token", token, 24*60*60, "/", "localhost", false, true)
	c.JSON(200, DoctorLoginResponse{
		Token:  token,
		Number: loginRequest.EmpId,
	},
	)
}

func (api *ApiServer) handlePatientTransfer(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error Authenticating JWT for patient transfer")
		log.Println("ERR:", err)
		c.JSON(500, err)
		return
	}
	var transferPatientRequest TransferPatientRequest
	err = c.BindJSON(&transferPatientRequest)
	if err != nil {
		log.Println("Error binding json for patient transfer")
		c.JSON(400, err)
		return
	}
	patient, err := api.store.GetPatient(transferPatientRequest.PId)
	if err != nil {
		log.Println("Error getting patient from db")
		log.Println("ERR:", err)
		c.JSON(500, err)
		return
	}
	patient.DocId = transferPatientRequest.ToDocId
	err = api.store.UpdatePatient(transferPatientRequest.PId, patient)
	if err != nil {
		log.Println("Error transferring patient in db")
		log.Println("ERR:", err)
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Patient Transferred")
}

func (api *ApiServer) handlePatientCreation(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error Authenticating JWT for patient creation")
		c.JSON(500, err)
		return
	}
	var createPatientRequest CreatePatientRequest
	err = c.BindJSON(&createPatientRequest)
	if err != nil {
		log.Println("Error binding json for patient creation")
		c.JSON(400, err)
		return
	}
	pId, err := api.store.CreatePatient(createPatientRequest)
	if err != nil {
		log.Println("Error creating patient in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, pId)
}

func (api *ApiServer) handleAllPatients(c *gin.Context) {
	patients, err := api.store.GetAllPatients()
	if err != nil {
		log.Println("Error getting all patients from db")
		c.JSON(500, err)
	}

	jwtToken := c.Request.Header.Get("Authorization")
	if jwtToken == "" {
		log.Println("Error getting JWT from header")
		c.JSON(401, "Unauthorized")
		return
	}
	token, err := ValidateJWT(jwtToken)
	if err != nil {
		log.Println("Error validating JWT for all patients")
		c.JSON(500, err)
		return
	}
	if !token.Valid {
		log.Println("Error validating JWT for all patients")
		c.JSON(401, "Unauthorized")
		return
	}

	c.JSON(200, patients)
}

func (api *ApiServer) handleJWT(c *gin.Context) error {
	jwtToken := c.Request.Header.Get("Authorization")
	if jwtToken == "" {
		log.Println("Error getting JWT from header")
		c.JSON(401, "Unauthorized")
		return jwt.ErrInvalidKey
	}
	token, err := ValidateJWT(jwtToken)
	if err != nil {
		log.Println("Error validating JWT for handleJWT")
		c.JSON(500, err)
		return err
	}
	if !token.Valid {
		log.Println("Error validating JWT for handleJWT")
		c.JSON(401, "Unauthorized")
		return jwt.ErrInvalidKey
	}
	return nil
}

func (api *ApiServer) handlePatientSearch(c *gin.Context) {
	query := c.Query("q")
	if query == "all" {
		patients, err := api.store.GetAllPatients()
		if err != nil {
			log.Println("Error getting all patients from db")
			c.JSON(500, err)
		}

		//reverse the patients array
		for i := len(patients)/2 - 1; i >= 0; i-- {
			opp := len(patients) - 1 - i
			patients[i], patients[opp] = patients[opp], patients[i]
		}

		c.JSON(200, patients)
		return
	}
	patients, err := api.store.SearchPatient(query)
	if err != nil {
		log.Println("Error searching for patient")
		c.JSON(500, err)
		return
	}
	c.JSON(200, patients)
}

func (api *ApiServer) handlePatientDelete(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for patient delete")
		c.JSON(500, err)
		return
	}
	pId := c.Param("p_id")
	err = api.store.DeletePatient(pId)
	if err != nil {
		log.Println("Error deleting patient from db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Patient Deleted")
}

func (api *ApiServer) handlePatientUpdate(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for patient update")
		c.JSON(500, err)
		return
	}
	pId := c.Param("p_id")
	var updatePatientRequest Patient
	err = c.BindJSON(&updatePatientRequest)
	if err != nil {
		log.Println("Error binding json for patient update")
		c.JSON(400, err)
		return
	}
	err = api.store.UpdatePatient(pId, updatePatientRequest)
	if err != nil {
		log.Println("Error updating patient in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Patient Updated")
}

func (api *ApiServer) handleUserPaid(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for user paid")
		c.JSON(500, err)
		return
	}

	pId := c.Param("p_id")

	patient, err := api.store.GetPatient(pId)
	if err != nil {
		log.Println("Error getting patient from db")
		c.JSON(500, err)
		return
	}
	patient.Paid = true

	err = api.store.UpdatePatient(pId, patient)
	if err != nil {
		log.Println("Error updating patient paid status in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "User Paid")
}

func (api *ApiServer) handleNextAppointment(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	var nextAppointmentRequest NextAppointmentRequest
	err = c.BindJSON(&nextAppointmentRequest)
	if err != nil {
		log.Println("Error binding json for next appointment")
		c.JSON(400, err)
		return
	}
	patient, err := api.store.GetPatient(nextAppointmentRequest.PId)
	if err != nil {
		log.Println("Error getting patient from db")
		c.JSON(500, err)
		return
	}
	patient.NextAppointment = nextAppointmentRequest.NextAppointment
	err = api.store.UpdatePatient(nextAppointmentRequest.PId, patient)
	if err != nil {
		log.Println("Error updating patient next appointment in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Next Appointment Updated")
}

func (api *ApiServer) handleNewPending(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	var newPendingRequest PendingRequest
	err = c.BindJSON(&newPendingRequest)
	if err != nil {
		log.Println("Error binding json for next appointment")
		c.JSON(400, err)
		return
	}
	err = api.store.CreatePending(newPendingRequest.PId, newPendingRequest.DocId)
	if err != nil {
		log.Println("Error creating pending in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Pending Created")
}

func (api *ApiServer) handleDeletePending(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	var deletePendingRequest PendingRequest
	err = c.BindJSON(&deletePendingRequest)
	if err != nil {
		log.Println("Error binding json for next appointment")
		c.JSON(400, err)
		return
	}
	err = api.store.DeletePending(deletePendingRequest.PId)
	if err != nil {
		log.Println("Error deleting pending in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Pending Deleted")
}

func (api *ApiServer) handlePending(c *gin.Context) {
	docIdParam := c.Param("doc_id")

	docId, err := strconv.Atoi(docIdParam)
	if err != nil {
		log.Println("Error converting doc_id to int")
		c.JSON(400, err)
		return
	}

	err = api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	pending, err := api.store.GetPending(docId)
	if err != nil {
		log.Println("Error getting pending from db")
		c.JSON(500, err)
		return
	}

	c.JSON(200, pending)
}

func (api *ApiServer) handleNewTransaction(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	var transactionRequest TransactionRequest
	err = c.BindJSON(&transactionRequest)
	if err != nil {
		log.Println("Error binding json for next appointment")
		c.JSON(400, err)
		return
	}
	err = api.store.CreateTransaction(transactionRequest)
	if err != nil {
		log.Println("Error creating transaction in db")
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Transaction Created")
}

func (api *ApiServer) handleViewAllTransactions(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	transactions, err := api.store.GetAllTransactions()
	if err != nil {
		log.Println("Error getting transactions from db")
		c.JSON(500, err)
		return
	}

	c.JSON(200, transactions)
}

func (api *ApiServer) handleViewTransaction(c *gin.Context) {
	err := api.handleJWT(c)
	if err != nil {
		log.Println("Error validating JWT for next appointment")
		c.JSON(500, err)
		return
	}

	transactionIdParam := c.Param("transaction_id")

	transactionId, err := strconv.Atoi(transactionIdParam)
	if err != nil {
		log.Println("Error converting transaction_id to int")
		c.JSON(400, err)
		return
	}

	transaction, err := api.store.GetTransaction(transactionId)
	if err != nil {
		log.Println("Error getting transaction from db")
		c.JSON(500, err)
		return
	}

	c.JSON(200, transaction)
}

func (api *ApiServer) handleViewSource(c *gin.Context) {
	c.Redirect(301, "https://github.com/newtoallofthis123/doc_cache/tree/main/backend")
}

func (api *ApiServer) Start() error {
	r := gin.Default()

	config := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:4321"},
		AllowedMethods: []string{"GET", "POST"},
	})

	// Use the CORS middleware
	r.Use(config)

	//! Will be used in production
	err := r.SetTrustedProxies(nil)
	if err != nil {
		return err
	}

	//# All The Get Routes
	r.GET("/", api.handleHello)
	r.GET("/doctors/:doc_id", api.handleGetDoctor)
	r.GET("/patients/:p_id", api.handleGetPatient)
	r.GET("/emp/:emp_id", api.handleEmpGet)
	r.GET("/auth", api.handleAuth)
	r.GET("/all", api.handleAllPatients)
	r.GET("/search", api.handlePatientSearch)
	r.GET("/source", api.handleViewSource)
	r.GET("/pending/:doc_id", api.handlePending)
	r.GET("/transactions", api.handleViewAllTransactions)
	r.GET("/transactions/:transaction_id", api.handleViewTransaction)

	//# All The Post Routes
	r.POST("/login", api.handleDoctorLogin)
	r.POST("/emp/login", api.handleEmpLogin)
	r.POST("/new/doctor", api.handleDoctorCreation)
	r.POST("/new/patient", api.handlePatientCreation)
	r.POST("/new/employee", api.handleEmpCreation)
	r.POST("/pend", api.handleNewPending)
	r.POST("/new/transaction", api.handleNewTransaction)

	//# All The Put Routes
	r.POST("/update/:p_id", api.handlePatientUpdate)
	r.PUT("/paid/:p_id", api.handleUserPaid)
	r.PUT("/next_appointment", api.handleNextAppointment)
	r.PUT("/transfer", api.handlePatientTransfer)

	//# All The Delete Routes
	r.DELETE("/delete/:p_id", api.handlePatientDelete)
	r.DELETE("/complete", api.handleDeletePending)

	err = r.Run(api.listenAddr)
	return err
}
