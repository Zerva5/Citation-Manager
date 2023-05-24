# Citation Manager
Citation manager allows you to manage the research sources for your projects.

# Setup
Right now on first run the MongoDB container will not have a login for the backend user. To get everything working you have to create the database `citman`, create a user with read/write access, and then change the hardcoded username/password in the mongoose connection code.

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
- Project editing endpoint needs to be finished before front end work starts on project page
  - Projects should record the order of the citations
- Password validation (ex. more than n characters, upper and lowercase, etc)
- Rate limiting (way later)
- Middleware for projects and citations to validate the user has access to them
- Lots more!


## Front End (besides standard design work)
- Automatically fetching a new access token when given a token error from the API
- 

# Finished
## API
- /login, /register routes are fully functional
- Can get a project by ID after authenticating user with a token
- Access and refresh tokens!
- Many small things (death by 1000 cuts)

# Front End
- Login & Register pages
- Communication with access tokens
- Basics of loading user profile on login
