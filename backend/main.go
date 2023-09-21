package main

import (
	"fmt"
	"log"
)

func main() {
	fmt.Println("DocCache")

	store, err := NewDBInstance()
	if err != nil {
		log.Fatal(err)
	}
	defer store.Db.Close()

	if err := store.Init(); err != nil {
		log.Fatal(err)
	}

	api := NewApiServer(":2468", store)

	err = api.Start()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("DocCache Started on port 2468")

}
