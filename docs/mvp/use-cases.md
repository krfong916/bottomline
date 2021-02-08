use cases are either commands or queries
# MVP

## Subdomains
- Posting - we must do ourselves
- IAM (Users) - we could use a vendor
- Articles

keep subdomains separate - monolith
this logical separation is essential for breaking our arch into independently deployable units (microservices) in DDD separate bounded-contexts

If we wanted to run subdomain as microservices, instead of a monolith, we'd utilize a message broker like RabbitMQ or Amazon MQ

## Posts
### Moderator
- submit report for review
- upvote/downvote on post under review
- a mod can do everything that a reader can do

### Authors
- post a report
- upvote reports
- submit report for review
- get reports they've posted
- remove reports they've posted
- edit reports they've posted
- create a tag
- get reports by tag
- get all reports (show if the report has been edited like yt comment)
- get reports by id

### Entities
- Report
- Tag

## Community
### Writers
- submit request to be mod
- remove request to be mod
- report user

### Moderators
- get users requesting to be mod
- make user a mod
- ban user
- submit mod to be reviewed by mods
- upvote/downvote on mod being reviewed
- submit directions

## Users
- login
- logout
- verify email
- change password

# Future
## Articles
### Mod 
get users requesting to be editor

### Reader
upvote an article

### Editor
post an article
edit an article (add to it and edit it)

## Community
user can do tagging

Tactics and actions would be important

Tactics the anti-union, police, or admin do and associate with an ongoing action or connect it to an ongoing fight