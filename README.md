# Citation Manager
Citation manager allows you to manage the research sources for your projects.

## API
### Endpoints
#### `/public`: Don't require an access token
- `POST` `/public/login` {email, password} -> {accessToken, refreshToken, user}: Logs a user in. `200` for success
- `POST` `/public/register` {email, password, name} -> {}: Registers a user. `200` for success
#### `/protected`: Require valid access token
#### `/token`: Require valid refresh token
- `POST` `/token/refresh` {authentication} -> {accessToken, refreshToken}: Gets a new access token and refresh token. Refresh token is passed as an authentication header


# Todo:
## API
- Have tokens stored in the db so that if a new token has been issues the old tokens, despite not being expired, are no longer valid.
- Create the api routes for fetching, updating, etc projects and citations.
- Citations first.
- somehow have to handle people being able to view the projects with a permalink? Actually no, private only 
- Projects should record the order of the citations


## Front End
- All of it lmao
