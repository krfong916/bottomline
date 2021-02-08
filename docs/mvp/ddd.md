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

## SOLID
### S: Single Responsibility
A class should only have one reason to change
The key here is to have the architecture scream at you!! Separate responsibility based on social structure of the application

If we couple logic together from different areas (although they may perform the same type of operation), that's bad b/c breaking changes will happen.

Example
```typescript
class Employee {
  public calculatePay (): number {
    // implement algorithm for hr, accounting and it
  }
  public reportHours (): number {
    // implement algorithm for hr, accounting and it
  }

  public save (): Promise<any> {
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
We can then dependency inject that service into our classes **WHILE** *making sure that we refer to the interface it belongs to* rather than the concrete implementations.

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
public interface Vehicle {}
class Car implements Vehicle {}
// however, what happens when we need autonomous and non-autonomous vehicles?
public interface Vehicle {}
public interface NonAutonomousVehicle extends Vehicle {}
public interface AutonomousVehicle extends Vehicle {}
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

``` java
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

### YAGNI, KISS, and DRY
You aren't gonna need it
Keep it simple, stupid
Don't repeat yourself... haha stupid

