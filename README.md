# SneakPeak

## Backend (Express.js API)

### Setup

You need to have the following environment variables in your PATH or .env file:
| Environment Variable | Description |
| -------------- | --------------- |
| MONGODB_URI | The MongoDB connection string to your database |
| PORT | The port to run the app on (default: 3000) |
| JWT_SECRET | The secret phrase that will be used to sign JWTs for authentication |
| POSTMARK_SERVER_API | The Postmark API key for the 'server' or 'folder' to use |
| API_URL | The URL to this API (local or hosted) |

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
