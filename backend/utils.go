package main

import (
	"crypto/rand"
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"math/big"
	"os"
	"time"
)

func GetEnv() *Env {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	env := &Env{
		DB:        os.Getenv("DB"),
		Password:  os.Getenv("PASSWORD"),
		User:      os.Getenv("USER"),
		JwtSecret: os.Getenv("JWT_SECRET"),
	}
	return env
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func MatchPasswords(toCheck string, hashed string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(toCheck))
	return err == nil
}

func RanHash() string {
	characters := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var slug string

	for i := 0; i < 8; i++ {
		randomIndex, err := rand.Int(rand.Reader, big.NewInt(int64(len(characters))))
		if err != nil {
			fmt.Println("Error generating random index:", err)
			return ""
		}
		slug += string(characters[randomIndex.Int64()])
	}

	return slug
}

func CreateJWT(docId int) (string, error) {
	env := GetEnv()
	claims := &jwt.MapClaims{
		"expiresAt": time.Hour * 24,
		"docId":     docId,
	}
	secret := env.JwtSecret
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}

func ValidateJWT(tokenString string) (*jwt.Token, error) {
	env := GetEnv()
	secret := env.JwtSecret

	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})
}
