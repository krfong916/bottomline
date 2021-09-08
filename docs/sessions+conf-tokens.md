after they create users - we send a confirmation email

email confirmation

in email: button that has the invite token url
thebottomlineapp.com/invite?confirmation=some_confirmation_token_here

click on the button, taken to a url

when the page is rendered
there's a button to confirm account

- that fires off a loading please wait button

we get the token off of the url path
and make a post request to an endpoint
that endpoint is confirm_account

...server work...

if the response back is okay then we say the confirm account was successful and redirect them back to the login page

if the response back was not okay, then we say, there's an error, please contact here if you have questions (twitter DM)

Error scenarios:
will require manual operation

- if there is an error between the time that they create a user and make a request to send email and then they create a user again with the same email, they get a user is created
- an email will be sent...

- our operation is a xaction so the op is atomic - creating a user and claiming the invite. Now they need to claim the token

sessions API

deleteSession()
updateSession()
addSession()

getUsername()
addUsername()
deleteUsername()

on request: getSession()
check if the user has an encrypted cookie on the header
if the user does, then check if the session is valid in redis
if the session is valid, then continue with the request
if the session is not valid, or the cookie is malformed, or no session exists then send an unauth

on create user
if the user has already been created, send back a response of ok, the client will handle the error
the client will need to send another request - to login (use their email)

if the user makes a log in request: getSession(), addSession()
check if they have an encrypted cookie on the header
if the user does, then check if the session is valid in redis
if the session is valid, then return a logged in - ok response
if the session is expired, or the cookie is malformed, or no session exists proceed with the login request

- on successful login, put the session identifier in redis
- send the response back to the user with a cookie

if the user makes a logout request: deleteSession()
check if they have an encrypted cookie on the header
if the user does, then check if session is valid in redis
if the session exists, delete it from redis
no need to wait for a response, log out the user on the client
send back an ok response to the user, log them out!

if the user makes a delete request: deleteSession()
check if they have an encrypted cookie on the header
if the user does, then check if session is valid in redis
if the session exists, delete it from redis
delete the user in the database and send a response back to the client
if the response does not occur within expected latency or there is an internal error, notify the user and tell them that they cannot delete at this time

store usernames in redis - this can be the use case for promises inflight

case: users signs up w/existing email
assume all info is correct:
if a user wants to sign up with an existing email
if they have a valid invite, and an existing email
send a password reset email, on the client, just handle normally - "hey check your email!"

Need:

- [x] verify an invite token (write code that doesn't revoke it)

- [x] test redis session middleware
- [x] create a valid user path

  - [x] addSession() method
  - [x] session cookie properties an object
  - [x] create a new user, on login, add the cookie in the store

- [x] verify a cookie:
  - [x] implement getSession()
  - [x] make a simple request to a posts route and we,
  - [x] get it off the header, and decode it
  - [x] cookie secret - environment variable signs the cookie
- [x] test rate limiter middleware

* we want complete control when we save a session
* we want to verify that a session is created
* we want to know if we need a session id
* we want to know if our authentication rate-limiter works
* should we return an async function
* how do we check if a session id exists in the session store?

-> how do we test? what do we test

- create a user
- login with the user, a session should be stored in our session store
- login request, we hit our middleware
- delete a user, should also delete the session that belongs to that user
- create a user with an invalid invitation: n-times to trigger our rate-limiter

https://medium.com/@rgoyard/road-to-microservices-with-node-js-events-and-rabbitmq-17acd4b199f3

- [ ] email: verify

  - [ ] create user
  - [ ] and send email
  - [ ] add rabbitmq and test for messaging failure and make events
  - [ ] fault injection in docker containers - rabbitmq should persist to disk and resend messages and keep sending until they get a reply - secondly, messages should be idempotent
  - [ ] delete user - delete a cookie
  - [ ] already signed up and haven't received an email? if your account exists, check your inbox for the confirmation email (throttle this b/c we might fail to deliver the email)

  - [ ] db column that has verified/confirmation in it
  - [ ] they use the email, sign in using that and THEN we add the session to the store and send back a signed cookie

- [ ] email: reset password
  - [ ] go over "that case"

* [ ] failure scenarios - redis fails or cannot connect to redis
      https://expressjs.com/en/advanced/best-practice-security.html

* when they request the app - and w/e route
  - the app shell is delivered from CDN, first request is made to thebottomlineapp.com endpoint
  - on the client just show the
  - we check if they're authenticated on the server - if they're authenticated, then send a 200 response
    - failure scenario: we time out or they aren't authenticated, then show landing page
  - if ok, then route them to the page
  - that should load the component and do data fetching as normal

caching strategies

- write-through
- read-through
- cache-aside

- [x] set user environment variables for redis - where do we create the config?
- [x] establish a connection with redis
- [ ] write a session to redis and retrieve it

- [ ] where do we define and instantiate a new client?
- [ ] create a session and store it

* a single client is instantiated when a request comes in and it matches our use case
* the session ID is saved on the cookie, the session itself is stored server-side
* connect-redis is a session store library to allow us to store session data in Redis
* cookie is the settings object for the session ID cookie
* saveUninitialized - a new session

- redis is single-threaded, no need for pooling (we're not using pub/sub here)
- does the client support async await/promises?
- what do we need on our session cookie?
  - ssl only
    - secure connections
  - http only
    - never accessed by javascript
  - same-site=strict
    - prevents CSRF
  - max age:
    - 2 weeks
  - secret:
    - part of config...

middleware for sessions
adapter for a cache

- interface
- implementation for that interface
- integration testing
- we don't want to mock a redis cache because the implementation will change underneath - we do, however, want to test our API - so we'll just call the API and make sure we get back what we need

is this a service? And if yes, what do we need to know about services in DDD?
