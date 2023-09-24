print("DocCache Scipts: setup_db.py")

import os

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