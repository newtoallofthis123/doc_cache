# DocCache FrontEnd

The DocCache Hospital Management system boasts of a very _fast_, _responsive_ and _easy to use_ interface. It is built using the [Astro.js](https://astro.build) framework and is powered by [React](https://react.dev) and [TailwindCSS](https://tailwindcss.com).

It is __not__ a SPA (Single Page Application) and is rendered on the server. This means that the website is __fast__ and __more accessible__ than a SPA.
You can run this stuff on the toaster and it will probably still work and be just as fast.

However, this also comes under a small caveat. The website is not as interactive as a SPA. This means that you will have to reload the page to see changes. This might not be that big a deal for a hospital management system, but it is still taken care of: every request automatically refreshes the page.

## Screenshot

![ScreenShot of the dashboard](/frontend/public/screenshot.png)

## Doctor Flow

The doctor flow is the main part of the website. It is the part that is used by the doctors and nurses to manage the patients.

Most to all parts of the doctor flow are auth protected. This means that you will have to login to access them.
To create a doctor, a special interface is not provided and it is meant to be done manually by the admin, using the following SQL query executed on the database:

```sql
INSERT INTO doctors (full_name, gov_id, password)
VALUES ("Doctor Name", "1213s", "password")
```

The doctor flow is divided into 3 parts:
1. Auth
2. Dashboard
3. Patient
4. Finances

### Auth

The auth part of the doctor flow is used to login and logout of the website. It is the first page that you will see when you visit the website.

### Dashboard

The dashboard is the main part of the doctor flow. It is the part that is used to manage the patients. 
It features a simple `add` form to add new patients and a table with a fast search bar to view all the patients.

The search algorithm is very fast. It is a modified version of substring search algorithm.
The substring search algorithm is ideal for searching large amounts of data. It is very fast and is known for its speed.

### Patient

The patient flow is the crux of the doctor flow. It provides an easy to interface to manage the patients. 
You can perform the following actions on the patient:
1. View
2. Update
3. Payment Status
4. Delete
5. Next Appointment
6. Transfer to another doctor

The patient flow is also auth protected. This means that you will have to login to access it.

### Finances

The finances part of the doctor flow is used to manage the finances of the hospital.
It is still under development and is not yet ready for production use.

## Installation

First Clone the mono repo:

```bash
git clone https://github.com/newtoallofthis123/doc_cache.git
cd doc_cache
```

Note that even though the backend is independent of the frontend, the frontend is not independent of the backend. This is because the frontend is rendered on the server and the backend is used to fetch data.

Without the backend running _perfectly_, at the exact same address (`localhost:2468`), even the home page will not load.

### Running the backend

The backend is a very fast server written in [Go](https://golang.org). You can find the installation instructions [here](https://github.com/newtoallofthis123/doc_cache/tree/main/backend#installation).

Once you have the backend running, you can run the frontend.

### Running the frontend

The frontend is relatively easy to get running. First up you have to install the dependencies:

```bash
npm install
```

Then you can run the development server:

```bash
npm run dev
```

This will start the development server on `localhost:4321`. You can access the website by going to `localhost:4321` in your browser.

## Hosting the website

It is not recommended to host the website on a server.
Although all the data is stored in the database, the website is not secure. It is not recommended to host the website on a public server, especially if you are storing sensitive patient data.

## Contributing

Contributions are welcome. Just clone the repo, make your changes and open a pull request.
However, if the changes are major or you want to add a new feature, it is recommended to open an issue first.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.