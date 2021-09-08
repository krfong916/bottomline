Have an invite? Enter it here (Sign Up button)

_only allow valid invites_
Sign up page
(invites are valid until claimed)
(unclaimed invite - exists in the db and has not claimed associated)
(claimed invite - a user has completed the sign up flow and claimed exists in the database - do not associate invite with person who signed up only that the code has been claimed)

Information:
email (check if valid domain)
username (check if valid)
tags - choose up to 5 tags what you're interested in (categories here)
password

error states - not a valid email by client standards
username - username is taken (use redis for this put on the server oh well) (if the request returned is not good - error message (sorry, we cannot verify whether the username is taken or not. We apologize for this error, you will have to signing up at a later time (link reasons)))

Send thank you signing up email (put a rabbit MQ and event here) (microservice for portfolio here)

Existing user?
username/email
password

error states - email or password does not exist (send a reset password/email)
Send reset email

- enter your email
  (figure out this feature)

Sessions
give JWTs for sessions - store in redis

Logout

Make and submit anon reports
information required

- company, organization (autocomplete) (tag company)
- what happened
- affected...

Upvote

Role based auth

- user sees x, admin sees y
- protected routes and actions

Input (placeholder)
Type = form? error states on form
Tags (square, rounded, with icon (allow svg))
Pagination
Card
Avatars
Search
Tooltip
Autocomplete...?

D3 Visualization:
by movement
by category (race, gender, pregnancy discrimination)
by organization
by industry

Use
Terraform to automate the server creation

MVP - March
Login/Signup/Sessions (this week)
Create/View/Delete/Edit(with edited status like yt comment)/Upvote (next week)
D3 vizualization (the following week)
User profile: download data, invites remaining (the last week)

- Define roadmap and infos + how-tos

Soft release:
Social Media Release

- call for collaborators
- twitter, linkedin, discord slack etc.
  Job Interviewing

- info-sec audit
  Next Steps Blog - Activist Professors can communicate their work

ABAC

how to do ABAC per resource?

XCAML is the markup language to help us define ABAC (extensible access control markup language)

- it is technology neutral, and vendors can implement XCAML
- axiomatics is a vendor
- OPA (open-policy agent) is an open-source toolset and framework for creating and managing policies across a stack (it's geared for K8s)

There does exist open source frameworks for implementing ABAC

- I assume this is an architecture

rbac generalizes the idea of a role. A role provides authorization over resources

ABAC

- abac provides fine-grained authorization, attribute and policy-based authorization
- authorization logic is stored as policies using attributes. Permissions are stored in the policy

How can we implement attribute-based-authorization-control

we can provide abac later - that's a later iteration
