# CAPSTONE_PROJECT
For launching the containers use:
docker compose up --build

## Environment variables

This repo uses a root `.env` file (ignored by git) for local configuration.

- **Frontend**
  - `REACT_APP_API_URL` (default `http://localhost:8000`)
  - `REACT_APP_AUTH_ENABLED` (default `false`)  
    When `false`, route protection + token validation + Google auth UI are bypassed (useful for tests).

- **API**
  - `JWT_SECRET_KEY`
  - `SECRET_KEY`
  - `GOOGLE_OAUTH_CLIENT_ID`
  - `GOOGLE_OAUTH_CLIENT_SECRET`
  - `GOOGLE_OAUTH_REDIRECT_URI`

Rebuild:
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## BRANCH NAMING CONVENTIONS

### Format 

sp<Sprint_Number>_st<Story_Number>_task_name_in_short<Task_Number>

### Few example:
sp1_st1_api1 \
sp1_st1_db1

## COMMIT NAMING CONVENTIONS

### Format

< JIIRA-ID / Task ID > Short description of the taks < Other Student >

### Few example:

CAP-49 Frontend Task of the third user story < Francesco Matano \>

