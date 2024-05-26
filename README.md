# SneakPeak

## Frontend (Vue.js 3 + Vite)

### Setup

You need to have the following environment variables set up in your .env.local file:
| Environment Variable | Description |
| -------------- | --------------- |
| VITE_API_URL | The URL to this project's API |

### How to run

1. `cd` into the frontend sudirectory

```sh
cd ./frontend
```

2. Install the project dependencies

```sh
npm install
```

3. Run the app

```sh
npm run dev
```

## Backend (Express.js API)

### Setup

You need to have the following environment variables set up in your .env file:
| Environment Variable | Description |
| -------------- | --------------- |
| MONGODB_URI | The MongoDB connection string to your database |
| PORT | The port to run the app on (default: 3000) |
| JWT_SECRET | The secret phrase that will be used to sign JWTs for authentication |
| POSTMARK_SERVER_API | The Postmark server API key that will be used to send emails |
| API_URL | The URL to this API |
| WEBAPP_URL | The URL to this project's webapp |
| DATABASE_URL | The PostgreSQL connection string |

### How to run

1. `cd` into the backend subdirectory

```sh
cd ./backend
```

2. Install the project dependencies

```sh
npm install
```

3. Run the app

```sh
npm start
```
