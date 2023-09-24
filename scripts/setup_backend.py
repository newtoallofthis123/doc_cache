print("DocCache Scipts: setup_backend.py")

import os

#change to backend directory
os.chdir("../backend")

# Check if psql is installed
print("Checking if psql is installed")
psql_check = os.system("psql --version")
if psql_check != 0:
    print("psql is not installed")
    print("Install from https://www.postgresql.org/download/")
    print("Please install psql and try again")
    exit(1)
else:
    print("psql is installed")

print("Creating db with name: doc_cache")
proceed = input("Proceed? (y/n): ")
if proceed == "y":
    os.system("createdb doc_cache")
    print("Database created")

# Check if go is installed
print("Checking if go is installed")
go_check = os.system("go version")
if go_check != 0:
    print("go is not installed")
    print("Install from https://golang.org/doc/install")
    print("Please install go and try again")
    exit(1)
else:
    print("go is installed")

print("Building backend")
x = os.system("go build -o bin/doc_cache")
if x != 0:
    print("Build failed")
    exit(1)
else:
    print("Build successful")

print("Running backend")
os.system("./bin/doc_cache")