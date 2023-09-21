package main

import (
	"fmt"
	"strconv"

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
	c.JSON(200, "DocCache API v.0.1")
}

func (api *ApiServer) handleGetDoctor(c *gin.Context) {
	docId := c.Param("doc_id")
	docIdInt, err := strconv.Atoi(docId)
	if err != nil {
		c.JSON(400, err)
		return
	}
	doc, err := api.store.GetDoctor(docIdInt)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, doc)
}

func (api *ApiServer) handleGetPatient(c *gin.Context) {
	pId := c.Param("p_id")
	patient, err := api.store.GetPatient(pId)

	if err != nil {
		c.JSON(500, err)
		return
	}
	jwtToken := c.Request.Header.Get("Authorization")
	if jwtToken == "" {
		c.JSON(401, "Unauthorized")
		return
	}
	token, err := ValidateJWT(jwtToken)
	if err != nil {
		c.JSON(500, err)
		return
	}
	if !token.Valid {
		c.JSON(401, "Unauthorized")
		return
	}

	fmt.Println(patient)
	c.JSON(200, patient)
}

func (api *ApiServer) handleDoctorCreation(c *gin.Context) {
	if c.Request.Method != "POST" {
		c.JSON(400, "Bad Request")
		return
	}
	var createDoctorRequest CreateDoctorRequest
	err := c.BindJSON(&createDoctorRequest)
	if err != nil {
		c.JSON(400, err)
		return
	}
	err = api.store.CreateDoctor(createDoctorRequest)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Doctor Created")
}

func (api *ApiServer) handleDoctorLogin(c *gin.Context) {
	if c.Request.Method != "POST" {
		c.JSON(400, "Bad Request")
		return
	}
	var loginRequest DoctorLoginRequest
	err := c.BindJSON(&loginRequest)
	if err != nil {
		c.JSON(400, err)
		return
	}
	hashedPassword, err := api.store.GetDocPassword(loginRequest.DocId)
	if err != nil {
		c.JSON(500, err)
		return
	}
	if !MatchPasswords(loginRequest.Password, hashedPassword) {
		c.JSON(401, "Unauthorized")
		return
	}

	token, err := CreateJWT(loginRequest.DocId)
	if err != nil {
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

func (api *ApiServer) handleDocAuth(c *gin.Context) {
	jwtToken := c.Request.Header.Get("Authorization")
	if jwtToken == "" {
		c.JSON(401, "Unauthorized")
		return
	}
	token, err := ValidateJWT(jwtToken)
	if err != nil {
		c.JSON(500, err)
		return
	}
	if !token.Valid {
		c.JSON(401, "Unauthorized")
		return
	}
	c.JSON(200, "Authorized")
}

func (api *ApiServer) handlePatientCreation(c *gin.Context) {
	if c.Request.Method != "POST" {
		c.JSON(400, "Bad Request")
		return
	}
	var createPatientRequest CreatePatientRequest
	err := c.BindJSON(&createPatientRequest)
	if err != nil {
		c.JSON(400, err)
		return
	}
	err = api.store.CreatePatient(createPatientRequest)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, "Patient Created")
}

func (api *ApiServer) Start() error {
	r := gin.Default()

	r.Use(cors.Default())

	//! Will be used in production
	err := r.SetTrustedProxies(nil)
	if err != nil {
		return err
	}

	//# All The Get Routes
	r.GET("/", api.handleHello)
	r.GET("/doctors/:doc_id", api.handleGetDoctor)
	r.GET("/patients/:p_id", api.handleGetPatient)
	r.GET("/auth", api.handleDocAuth)

	//# All The Post Routes
	r.POST("/login", api.handleDoctorLogin)
	r.POST("/new/doctor", api.handleDoctorCreation)
	r.POST("/new/patient", api.handlePatientCreation)

	err = r.Run(api.listenAddr)
	return err
}
