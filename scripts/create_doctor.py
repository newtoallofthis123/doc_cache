import requests

print("DocCache Scipts: create_doctor.py")

# Check if backend is running
print("Checking if backend is running")
try:
    r = requests.get("http://localhost:2468")
    if r.status_code != 200:
        print("Backend is not running")
        print("Please run backend and try again")
        exit(1)
    else:
        print("Backend is running")
except:
    print("Backend is not running")
    print("Please run backend and try again")
    exit(1)

print("Enter doctor details")
full_name = input("Name: ")
govt_id = input("Govt ID: ")
password = input("Password: ")

url = "http://localhost:2468/new/doctor"

payload = {
    "full_name": full_name,
    "gov_id": govt_id,
    "password": password
}
headers = {
    "Content-Type": "application/json",
    "User-Agent": "insomnia/2023.5.8"
}

print("Creating doctor")
response = requests.request("POST", url, json=payload, headers=headers)
print(response.text)


if r.status_code != 200:
    print("Doctor creation failed")
    print(r.json())
    exit(1)

print("Doctor created")