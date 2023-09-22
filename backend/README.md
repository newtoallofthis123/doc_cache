# Doc Cache Backend

The Doc Cache Backend is the core component of the Doc Cache system. It is a
super fast Go server that stores and retrieves documents from a Postgres database.

The database is powered by [Gin](https://gin-gonic.com/), a high performance
HTTP web framework written in Go. Gin is used to handle all HTTP requests and
responses. The database is powered by [lib/pq](https://github.com/lib/pq), a
pure Go Postgres driver for the database/sql package. 
So, all the queries are actually written in SQL.

All these small things make the Doc Cache Backend super fast, or as ThePrimagen would say, blazingly fast. It can handle
thousands of requests per second on a single machine.
These are some of the benchmarks run on a Lenovo IdeaPad3 with an AMD Ryzen 5 5625U processor and 12GB of RAM.

- `GET` - 10ms to 20ms ~ 1000 requests per second
- `POST` - 100ms to 190ms ~ 920 requests per second
- `PUT` - 150ms to 190ms ~ 900 requests per second
- `DELETE` - 50ms to 100ms ~ 950 requests per second

## Installation

For now, the only way to install the Doc Cache Backend is to build it from source.
Don't worry. It is relatively lightweight and easy to build.

### Prerequisites

- Go 1.16 or higher
- Postgres 13 or higher
- Git
- GNU Make
- GCC

### Building

1. Clone the repository

The Doc Cache is a monorepo. So, you will have to clone the entire repository.
Don't worry, the frontend is not that big and is completely independent of the
backend.

```bash
git clone https://github.com/newtoallofthis123/doc_cache/
cd doc_cache/backend
```

2. Build the binary

```bash
make build
```

3. Run the binary

```bash
./bin/doc_cache.exe
```

## Usage

The Doc Cache Backend is a HTTP server. So, you can use any HTTP client to
interact with it. The Doc Cache Frontend is a good example of a client.

### API

Now, I don't really have a very good API documentation. However, you can see
the `types.go` file to get a good idea of the API.

Here is a quick overview of the API, this is a screenshot from the Gin Configuration.

![API](/backend/assets/api.png)

Those are all the endpoints that the Doc Cache Backend exposes.
Most to all of them are self explanatory and need a JWT token to access.

You can create the `/login` endpoint without a JWT token. It will return a JWT
token that you can use to access the other endpoints.
If you are using something like Insomnia or Postman, you can use the `Bearer`
authentication type to send the JWT token. A cookie will be set in the browser
if you are using the Doc Cache Frontend.

### Configuration

The Doc Cache Backend uses a simple `.env` file to configure itself. You can
just use the `.env.sample` file as a template.

```env
DB=db_name
PASSWORD=password
USER=user
JWT_SECRET=secret
```

- `DB` - The name of the database to connect to.
- `PASSWORD` - The password of the user to connect to the database.
- `USER` - The user to connect to the database.
- `JWT_SECRET` - The secret to use to sign the JWT tokens.

Remember, the Postgres database must be running on the same machine as the Doc
Cache Backend. It has to running on the default port, `5432` and `localhost`.

## Contributing

Contributions are welcome. You can open an issue or a pull request. If you are
opening a pull request, please make sure that you have tested your code.

## License

The Doc Cache Backend is licensed under the MIT License. See the `LICENSE` file
for more information.