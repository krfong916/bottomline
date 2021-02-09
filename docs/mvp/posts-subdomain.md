## Posts

### Use Cases

We immediately undertstand the features/capabilities of the subdomain, when we put use cases directly into a subdomain.

#### Moderator

- bookmark report for review by mods
- upvote/downvote on report under review
- get reports under review
- a mod can do everything that a reader can do
- get all users who flagged the report under review

#### Authors

- get reports by tag
- get all reports by tag (show if the report has been edited like yt comment)
- get reports by id: get tags, upvotes, users who upvoted, and whether it's been edited
- get all users who upvoted this report
- upvote report
- add report to upvote bookmark (similar experience)
- add report to bookmarks (save for later)
- post a report
- get reports they created
- remove reports they've created
- edit reports they've created

### Entity and Value Objects

#### Report

- identity of person involved
  - gender, race, sexuality, status, class
  - must have at least one
- tag of company or org
  - cannot be null
- tag of type of incident
  - cannot be null
- tag of field
  - cannot be null
- (optional) what happened
  - can be null

## Notes

A user is only for IAM
so then, we have a community member and they can have reputation (write an article, donate)
we have a community moderator (moderates posts and users/can vote to ban a user)
we have a contributor (writes to topic wiki)

- Use a domain service when we need to locate some business logic that doesnt belong to a particular domain entity -> domain service and entity == business logic
- Use cases (Application services) entire purpose is to simply fetch domain objects from persistence in order to execute some domain logic
- For example: in the AcceptOffer(offerId: OfferId) use case, all I have is the OfferId. That's not enough for me to do the accept action. I'm going to need the entire offer entity in order to save offer.accept() and dispatch a OfferAcceptedEvent domain event. To get the offer, I'll need to use a repository to retrieve & save it. That's how they're responsible for retrieving and spinning up an execution environment with domain entities.

- Possible Builder pattern for posts and article creation because the constructor parameters could get out of hand and we could have several flavors of a post
- In javascript, pass one object, the objects have named properties

```javascript
const burger = new Burger({
  size: 14,
  pepperoni: true,
  cheese: false,
  etc.
});
// instead of
const burger = new Burger(14, true, false, true, true);
```

## Questions

- How do we associate tagging with this subdomain?
- How do we associate upvoting with this subdomain?
- How do we chain use cases? Use the observer pattern with a message queue (example, when a report is below threshold and needs review, the mod in charge of that tag is notified)
