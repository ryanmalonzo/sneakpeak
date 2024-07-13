# SneakPeak

## Prerequisites

Before running the application, ensure you have the following installed:
- Docker
- Docker Compose

You also need to create a `.env` file at the root of the repository with the following environment variables:

| Environment Variable | Description | Sample Value |
| -------------- | --------------- | -------------- |
| MONGODB_URI | The MongoDB connection string to your database | mongodb://robin:batman@mongo:27017 |
| PORT | The port to run the app on (default: 3000) | 3000 |
| JWT_SECRET | The secret phrase that will be used to sign JWTs for authentication | <your_secret> |
| POSTMARK_SERVER_API_TOKEN | The Postmark server API key that will be used to send emails | <your_postmark_server_api_token> |
| API_URL | The URL to this API | http://localhost:3000 |
| VITE_API_URL | The URL to this API for the webapp | http://localhost:3000 |
| WEBAPP_URL | The URL to this project's webapp | http://localhost:5173 |
| DATABASE_URL | The PostgreSQL connection string | postgres://robin:batman@postgres:5432/sneakpeak |

## Running the application

To run the application, execute the following command:

```sh
docker compose up -d
```
