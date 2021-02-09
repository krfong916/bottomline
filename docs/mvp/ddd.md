Follow SOLID principles
write code that's testable
write code that's easily understood
write code where things are where they're expected to be
write code where classes narrowly do what they were intended to do
write code that can be adjusted and extended quickly
write code that can be adjusted and extended quickly without producing bugs
write code that separates the policy (rules) from the details (implementation)
write code that allows for implementations to be swapped out (think swapping out Email APIs, ORMs or web server frameworks)

## DDD

In order to do DDD well, keep SOLID in mind, use a lot of Dependency Injection/Inversion

Allow the architecture to grow incrementally if we maintain a proper separation of concerns - Racist Uncle Bob

essence of iterative, agile development. TDD and refactoring produce clean code, this code makes adjusting for growth possible.

Agility cannot be lost in code development - the benefits of TDD is lost
Write POJOs
Domain specific languages allow all levels of abstractions to be expressed as POJOs. POJOs are decoupled from any architectural concerns - so we gain the flexibility of being able to layer of technology/complexity later.

unaware of how to take advantage of abstractions to create better designs

### YAGNI, KISS, and DRY

You aren't gonna need it
Keep it simple, stupid
Don't repeat yourself... haha stupid

## SOLID

### S: Single Responsibility

A class should only have one reason to change
The key here is to have the architecture scream at you!! Separate responsibility based on social structure of the application

If we couple logic together from different areas (although they may perform the same type of operation), that's bad b/c breaking changes will happen.

Example

```typescript
class Employee {
  public calculatePay(): number {
    // implement algorithm for hr, accounting and it
  }
  public reportHours(): number {
    // implement algorithm for hr, accounting and it
  }

  public save(): Promise<any> {
    // implement algorithm for hr, accounting and it
  }
}
```

```typescript
abstract class Employee {
  // This needs to be implemented
  abstract calculatePay (): number;
  // This needs to be implemented
  abstract reportHours (): number;
  // let's assume THIS is going to be the
  // same algorithm for each employee- it can
  // be shared here.
  protected save (): Promise<any> {
    // common save algorithm
  }
}

class HR extends Employee {
  calculatePay (): number {
    // implement own algorithm
  }
  reportHours (): number {
    // implement own algorithm
  }
}

class Accounting extends Employee {
  calculatePay (): number {
    // implement own algorithm
  }
  reportHours (): number {
    // implement own algorithm
  }

}

class IT extends Employee {
  ...
}
```

Instead, we can separate and allow each area to implement the operation on their own, however
Design Tip: If we see lots of code in switch statements, that should be a signal to us of a potential refactoring from a switch statement to several classes.

### O: Open Close

- Classes should be open for extension, closed for modification
- I.E. we need to write interfaces and abstract classes to dictate policy. And implement the policy using concrete classes.
  Example:
  We write a sendgrid class today, and the next we need mailchimp. Instead, we should write an interface for an email service that has ops. like `sendMail(from, to, body)` so we can simply loosely couple our concrete services.
  This principle strongly draws on the dependency inversion principle (depend on interface instead of concretions) and substitution principle (swap out implementations)

If the Use Case changes, it will likely effect the controller, data mappers (they create views), and database. The use case is the higher-level component. Higher level components should be protected from changes from lower-level components

### Liskov-Substitution

Pretty simple, assume f(). Regardless of the object that we pass to f(), the objects produced are equivalent in property (maybe not in value) (edit: understanding missing the mark). Concretely, interfaces and abstract classes define an API contract. Concrete classes fulfill that contract.
We can then dependency inject that service into our classes **WHILE** _making sure that we refer to the interface it belongs to_ rather than the concrete implementations.

If we can interchange the implementation of any service, then we're adhering to Liskov's Substitution.

### Interface Segregation

Prevent classes from relying on things that they don't need.
So, in order to use a class, a client (as in implementer of the interface) may need to implement the interface, but may not need all the operations required. It doesn't make sense to implement dummy methods.
This appears when the interface does too much and methods can be divided into several interfaces instead of one.

```java
class Bird {
  public void walk()
  public void canFly()
}

class Dodos implements Bird {
  // sike, they can't fly
}

// instead:

public interface CanFly {
  void fly();
}
```

Provide implementations without unnecessary cargo. Do I REALLY need all the methods on this interface we're using? If not, how can we break them into smaller interfaces?
If a client (as in implementer) does not need the method then the client should not know about or have to implement the method.

Interface: API contract of public methods and properties of a class
Another example:

```typescript
interface Vehicle {}
class Car implements Vehicle {}
// however, what happens when we need autonomous and non-autonomous vehicles?
interface Vehicle {}
interface NonAutonomousVehicle extends Vehicle {}
interface AutonomousVehicle extends Vehicle {}
```

### Dependency Inversion

Abstractions should not depend on concretions, concretions should depend on abstractions.

Classes should depend on Interfaces, interfaces should not depend on classes.

Stemmler explains why this is important"
This gives us the ability to test code because we leave the implementer to pass the **mocked** dependency (if we don't want to make API class or rely on something we're not currently interested in testing"

For example:

```typescript
// This
class CreateUserController extends BaseController {
  private emailService: IEmailService; // <- abstraction
  constructor (emailService: IEmailService) { // <- abstraction
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    // handle request

    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}

// and not this
class CreateUserController extends BaseController {
  // we're limiting ourselves to a particlar concrete class.
  private emailService: SendGridService; // <- concretion
  constructor (emailService: SendGridService) { // <- concretion
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    // handle request

    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}

// And for sure not this

class CreateUserController extends BaseController {
  // impossible to mock for tests
  private emailService: SendGridService = new SendGridService(); // <- concretion
  constructor () {
  }

  protected executeImpl (): void {
    // handle request

    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

Entities are domain objects that we uniquely identify: a user, a report, a tag, an article
Entities have a lifecycle, they can be created, updated, saved, retrieved, deleted, archived.
They have unique identifiers which allows them to be compared
Value Objects do not have unique identifiers, they are properties/attributes.
name on username

Aggregate is a collection entities bound together by a term called an aggregate root.
Why aggregates? What do they do?
**they dispatch domain events which can be used to co-locate business logic in the appropriate subdomain**

### Domain Services

domain logic that doesn't belong to any one domain object - they're executed by use cases

Who is responsible for making business decisions

```java
// original
public void WithdrawMoney(decimal amount)
{
    _atm.DispenseMoney(amount);
    // side effect
    decimal amountWithCommission = _atm.CalculateAmountWithCommission(amount);
    // side effect
    _paymentGateway.ChargePayment(amountWithCommission);
    _repository.Save(_atm);
}

// not the right way to extract the Domain Service
public void WithdrawMoney(decimal amount)
{
    decimal amountWithCommission = _atmService.DispenseAndCalculateCommission(
        _atm, amount);

    _paymentGateway.ChargePayment(amountWithCommission);
    _repository.Save(_atm);
}

public sealed class AtmService // Domain service
{
    public decimal DispenseAndCalculateCommission(Atm atm, decimal amount)
    {
        atm.DispenseMoney(amount);
        return atm.CalculateAmountWithCommission(amount);
    }
}

// The right way
public void WithdrawMoney(decimal amount)
{
    Atm atm = _repository.Get();
    _atmService.WithdrawMoney(atm, amount);
    _repository.Save(_atm);
}

public sealed class AtmService // Domain service
{
    public void WithdrawMoney(Atm atm, decimal amount)
    {
        if (!atm.CanDispenseMoney(amount))
            return ;

        decimal amountWithCommission = atm.CalculateAmountWithCommission(amount);
        Result result = _paymentGateway.ChargePayment(amountWithCommission);

        if (result.IsFailure)
            return;

        atm.DispenseMoney(amount);
    }
}

```

Domain services carry domain knowledge; application services don’t (ideally).

Domain services hold domain logic that doesn’t naturally fit entities and value objects.

Introduce domain services when you see that some logic cannot be attributed to an entity/value object because that would break their isolation.

You start out with your domain. All entities and any domain services that don't depend on external resources are implemented here. Any domain concepts that depend on external resources are defined by an interface.
More here:
http://dddsample.sourceforge.net/characterization.html
https://stackoverflow.com/questions/2268699/domain-driven-design-domain-service-application-service
https://enterprisecraftsmanship.com/posts/domain-vs-application-services/

### Data Transfer Objects

Data Transfer Objects are a (fancy) term for an object that carries data between two separate systems.

When we're concerned with web development, we think of DTOs as View Models because they're faux models. They're not really the REAL domain models, but they contain as much data that the view needs to know about.

### Domain Events

DDD - Create domain specific language through entities, value objects, domain events

Domain Events get created as close to the entity or aggregate root because they change/modify these objects.

Follow YAGNI when determining what methods an entity should have.
example: validation should be in a value object and not in the entity

operations that perform mutations to the aggregate root itself

### Aggregate Root

So, what is an aggregate root?

"Assume that we have a social network and have entities like Post, Like, Comment, Tag. (I believe you can imagine the relations between these entities) Some of the entities are "Aggregate Root"

To find the aggregate root(s) I try to find which entities cannot live without the other. For instance, Like or Comment cannot live without a Post. Then Post is an aggregate root and we need a PostRepository or turn the Post entity into a Repository (the famous collection like interface thing). CRUD operations for Comment and Like (as well as the Post) should remain on this repository.""

When essential properties of an aggregate root are accessed or changed, it makes sense to create and dispatch a domain event

Domain events are part of the domain, locate them on the entitiy or aggregate root

If we're able to generate events, then we allow several other applications to leverage those events however they please (using Rabbit MQ)

### Why getters and setters?

- Background: For domain objects, we only want to expose operations that are valid to the domain.
- What: Getters and Setters allow us to only expose the necessary data a domain object needs to expose
- What do they do: Getters and setters allows us to protect data invariants.
- How: Provide a method to add data in leiu of set, provide a way to get the data. Only provide a way to get data, no way to set. (doesn't make sense to change things after it's been created... such as an id)
- Where it's useful: `Acting as a facade, maintaining readonly values, enforcing model expressiveness, encapsulating collections, AND creating domain events are some very solid use cases for getters and setters in Domain-Driven Design.` - Khalil Stemmler

separate setup from runtime logic..?

### Anemic Domain Model

- What it is:
- Why it's a sign of a poorly understood domain:
- Causes:
  - lack of encapsulation/isolation
  - encapsulation: protect data integrity (what methods can be called at what point, what type of data is allowed? What are the required params/conditions to create this object?)
- Signs:
  - services contain all domain logic and domain objects themselves contain none
    - domain logic interchangeable with business logic - validations, calculations, business rules

### Where does validation logic go?

In a value object? on a domain object? is domain object synonymous with domain entity?

difference between application service/use case v. core business logic entity logic?
difference between entity logic and domain logic?

- Domain service logic: core business logic that does not fit on a single entity
- Entity logic: logic that belongs to a single entity
- Aggregate root: an entity has reference to other related entities
  - Initial / default values
  - Protecting class invariants (what changes are allowed, and when)
  - Creating Domain Events for changes, creations, deletions, and anything else relevant to the business. It's through domain events that complex business logic can be chained.

We wrap an orm in a repo i.e. encapsulate the data access logic. We have repo implementations

### Concrete Classes

Depend on interfaces and abstractions, not the other way around. We don't want to be locked in once we implement a class.

### Functional Error Handling

Throwing errors in the middle of execution feels like a GOTO statement. We want to streamline that process. Either a result is ok or it isnt. Where should errors be handled? If we look at errors from a DDD point of view, errors must be handled as a domain concept.

- Improved readability, less bugs (less null checks and if statements riddled everywhere)
- Richer expression of our domain model and reveals more about the actual problem
- Engineering pov: the calling code must have predictable, descriptive errors (instead of just null)

Value Objects can express the error and return an object, or an error with the type of error - expressive!

To make this happen: we need to leverage functional programming to provide an abstraction for distinguishing between types of errors and successes, and handling those errors and successes

```typescript
const emailOrError: Either<
  CreateUserError.EmailInvalidError,
  Result<Email>
> = Email.create({ email });

if (emailOrError.isLeft()) {
  return left(emailOrError.value);
}
```

### Designing and Persisting Aggregate Roots

Aggregate? a clump of objects. Entity relationship. Describes multiple entities as one thing.
Entity:

- vote
- author
- tag
  Aggregate root: the Post! The thing that collects it all together!
  The aggregate root is the main entity!

- how do we cascade and save the cluster of entities to the db? (without leaving objects in partial state)
- Must have skill determining aggregate boundary - that's the goal (protect model invariants, enable changes via commands)
- provide enough info so we can perform the update, and not break any business rules (like model invariants)

we don't want slow xactions
respect child entity invariants within the aggregate root
execute use cases
optionally: transform domain entity to a DTO

Changes to an aggregate = COMMAND
Return a value w/ no side-effects = QUERY

domain events belong in aggregate roots
When we think about Aggregate Roots, we think about it's relationship to other entities in 1-1, 1-many, many-many terms.

Aggregate roots dispatch domain events. As a result, we can apply the observer pattern

So, to update a particular field in an aggregate, should i do all these steps everytime.

- Fetch the entity from the database table.
- Convert/map the entity to domain model.
- Update the domain model with the requested field.
- Convert the domain model to database entity.
- Persist in database.
- Without DDD, i would achieve this with a simple update Query. **Smell Alert: transaction script**

#### How do we perform updates on aggregates?

Suppose we have to update only one attribute on a domain entity or on an aggregate, how should we proceed? Often times, for an entity to exist, we must have all its information. Updating a single attribute may violate our entity invariants.
Use the data mapper pattern. The process is:

- fetch the aggregate from persistence
- perform changes
- pass off to the repo to save, update, delete

There are challenges with step 2 and step 3.
Step 2:

- performing validation logic
- protect invariants of value objects
- represent errors properly and as domain concepts
- choosing how to update

--> we don't want to break an object'c `create()` factory method

Step 3:

- an atomic transaction?
- perform an update, insert, or delete?
- scaffolding across foreign key tables
  - an aggregate root may contain many entities so any change would involve "get foreign key here, here and here, finally use all the foreign key and put object"

1-to-1 relationships
1-to-many later

#### use case

remember that the responsibility of use cases at this layer are to simply fetch the domain objects we'll need to complete this operation, allow them to interact with each other (at the domain layer), and then save the transaction (by passing the affected aggregate root to it's repository).
We create a DTO to specify inputs for the use case
And dependency inject a repository so that we can get access to the aggregate that we want to change in the xaction
Lastly, we specify errors on the use case so that our client must handle the error states (use a namespace and specify properties, namespaces are plain javascript objects) and specify the result w/an explicit return type so the clients know what to expect
And then we do small updates, one for each attribute

update separately.
Use props + getters/setters for entities
Use a create factory to guard against invariant violations, ensure that public objects are valid objects
Add methods to update on the aggregate root
Use dependency injection for a repo, a data structure to track if changes are valid or if they're errors
functional error and result handling

### Advice

What is DDDs place in web application's? CQRS: don't retrieve an entire aggregation of information when you do not need it. Don't need an aggregate to query, get the data through a different mechanism, then do that consistently

A repository should have specific finder methods - query calls like getAllFlaggedPosts

A DDD service is only to be used for what an entity can't "answer/perform" themselves (getById, elevateUserToMod)

What is a service, and the difference between that and the repository?
What does a service do that a use case doesn't?

### Decoupling Logic with Domain Events
