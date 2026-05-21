# Steps to run

Follow the steps to run the project

## Install Dependencies

Run the following command:

```sh
pnpm install
```

## Setup environment

Create an .env file and fill the env variables as provided in .env.example

# Provide .env to all

Run the script provide as setup.sh .
For git bash in the root
```sh
./setup.sh
```

## test the setup is done
Checkout throught postman
```sh
http://localhost:8000/api/health
```

OR

Checkout throught UI ( check status )
```sh
http://localhost:8000
```

OR

Checkout throught docs (documentaion of all api routes)
```sh
http://localhost:8000/docs
```
