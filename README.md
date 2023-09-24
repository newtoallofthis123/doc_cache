# DocCache

Doc Cache is a very fast and easy to use hospital management system. It is built with Go and Astro.js

## Idealogy

DocCache is built with the idea of being a fast and easy to use hospital management system. It is built with Go and Astro.js.

The Backend is _very_ fast. It is built with Go and uses the [Gin](<https://gin-gonic.com/>) framework. Many different optimizations have been done to make the backend as fast as possible. You can read more about the backend [here](./backend/README.md)

The Frontend is built with Astro.js. Astro.js is a new framework that is MPA rather than SPA. It is very fast and easy to use. You can read more about the frontend [here](./frontend/README.md)

Here are some mind blowing stats about DocCache, all measured on my 2022 Lenovo Ideapad 3 with an AMD Ryzen 5 5500U and 12GB of RAM.

- The backend can handle 1200 requests per second with an average response time of 1.5ms
- It takes an average of 100ms to load the entire frontend
- The frontend is 100% accessible and scores 98% on Lighthouse
- The Backend is 100% tested and has 100% coverage across most know scenarios
- On an average, a patient record can be created in 2seconds, all the way from the frontend to the database

I know these stats are not very impressive, but I am working on improving them.
This is one of my first major mono repos and integrating all the different parts was a challenge, but boy was it fun.

## Features

A Management refers to CRUD operations and a few more operations that are required for a hospital management system.

- [x] Patient Management
- [x] Doctor Management
- [x] JWT Authenticated Requests
- [x] Appointment Management
- [x] Financial Management
- [ ] Prescription Management
- [ ] Report Management
- [ ] Inventory Management

## Installation

### Prerequisites

The following must be installed on a system to run DocCache

1. Go +[1.16](https://golang.org/)
2. Node.js +[v.16](https://nodejs.org/en/)
3. PostgreSQL +[13](https://www.postgresql.org/)

### Steps

These are the steps to install DocCache on your system.
Run these in the given order since they are co dependent.

1. Clone the repository

For ease of use, the DocCache is a mono repo that requires the running of running just two services, the backend and the frontend. The backend is written in Go and the frontend is written in Astro.js

```bash
git clone https://github.com/newtoallofthis123/doc_cache.git
```

2. Set up the database

DocCache uses PostgreSQL as its database. You only need to create the database and enter the name of the database in the `.env` file in the backend folder.

First, install PostgreSQL on your system. While installing, remember the username and password you set for the database and the port number to always be `5432`.

Then, create a database called `doc_cache`. If you have installed PostgreSQL on your system, you can use the following command to create the database.

```bash
createdb doc_cache
```

Fill the `.env` file in the backend folder with the following details

```bash
DB_NAME=doc_cache
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
```

Remember to change the `DB_USER` and `DB_PASSWORD` to the username and password of your PostgreSQL database.

3. Set up the backend

Detailed instructions on how to set up the backend can be found [here](./backend/README.md)

```bash
cd backend
go build -o doc_cache
./doc_cache
```

4. Set up the frontend

Detailed instructions on how to set up the frontend can be found [here](./frontend/README.md)

```bash
cd frontend
npm install
npm run dev
```

## Usage

Once you have done the above steps, you can access the DocCache at `http://localhost:4321`. The backend will be running on port `2468` and the frontend will be running on port `4321`.

Creating a Doctor has to be done manually by sending a POST request to `http://localhost:2468/new/doctor` with the following body

```json
{
  "full_name": "Doctor Name",
  "gov_id": "Gov ID",
  "password": "Password",
}
```

You can directly use the `create_doctor.py` in the `scripts` folder to create a doctor.

To create an employee, you can use the `create_employee.py`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

DocCache is licensed under the [MIT License](LICENSE)
