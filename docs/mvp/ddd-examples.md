




### Domain Logic and Domain Service


### Anemic Domain Model
Example of not DRY
```typescript
class CreateUserUseCase extends BaseUseCase<ICreateUserRequestDTO, ICreateUserResponseDTO> {
  constructor () {
    super();
  }

  exec (request: ICreateUserRequestDTO): ICreateUserResponseDTO {
    const { name, email } = request.user;
    const isValidName = UserValidator.validateName(name);
    const isValidEmail = UserValidator.validateEmail(email);
    if (isValidName && isValidEmail) {
      const user: User = User.create(name, email);
      // continue
    } else {
      // error
    }
  }
}

class EditUserUseCase extends BaseUseCase<IEditUserRequestDTO, IEditUserResponseDTO> {
  constructor () {
    super();
  }

  exec (request: IEditUserRequestDTO): IEditUserResponseDTO {
    const { name, email } = request.user;
    const isValidName = UserValidator.validateName(name);
    const isValidEmail = UserValidator.validateEmail(email);
    if (isValidName && isValidEmail) {
      const user: User = User.create(name, email);
      // continue
    } else {
      // error
    }
  }
}
```

If we add n-many more use cases, and m-many more properties (we'd have to write validators as well) this would mean we'd update every use case and ensure we've added the validation rule `n*m`

Instead, have a validator class consume a User object

Logic that doesn't belong to one domain should be a domain service
Any logic that performs ops on external resources (liek a 3rd party API) should belong to an Application Service i.e. use cases!

### Aggregate Root

...we'd discover that acceptOffer() and declineOffer() perform mutations to the Offer aggregate root itself.

Those operations can be done without the involvement of any other domain entities, so it makes sense to locate them directly on the Offer aggregate root.

```typescript
export type OfferState = 'initial' | 'accepted'  | 'declined'

interface OfferProps {
  ...
  state: OfferState;
}

export class Offer extends AggregateRoot<OfferProps> {
  ...

  get offerId (): OfferId {
    return OfferId.create(this._id);
  }

  get offerState (): OfferState {
    return this.props.state;
  }

  public acceptOffer (): Result<any> {
    switch (this.offerState) {
      case 'initial':
        // Notice how there is not a public setter for the
        // 'state' attribute. That's because it's important that
        // we intercept changes to state so that we can create and add
        // a Domain Event to the "observable subject" when it's
        // appropriate to do so.
        this.props.state = 'accepted';
        // And then we create the domain event.
        this.addDomainEvent(new OfferAcceptedEvent(this.offerId));
        return Result.ok<any>();
      case 'accepted':
        return Result.fail<any>(new Error('Already accepted this offer'));
      case 'declined':
        return Result.fail<any>(new Error("Can't accept an offer already declined"));
      default:
        return Result.fail<any>(new Error("Offer was in an invalid state"));
    }
  }

  public declineOffer (): Result<any> {
    switch (this.offerState) {
      case 'initial':
        // Same deal is going on here.
        this.props.state = 'declined';
        this.addDomainEvent(new OfferDeclinedEvent(this.offerId));
        return Result.ok<any>();
      case 'accepted':
        return Result.fail<any>(new Error('Already accepted this offer'));
      case 'declined':
        return Result.fail<any>(new Error("Can't decline an offer already declined"));
      default:
        return Result.fail<any>(new Error("Offer was in an invalid state"));
    }
  }

  private constructor (props: OfferProps, id?: UniqueEntityId) {
    super(props, id);
  }
}
```

It would be used in a use case like so

```typescript
export class AcceptOfferUseCase implements UseCase<AcceptOfferDTO, Result<Offer>> {
  private offerRepo: IOfferRepo;
  private artistRepo: IArtistRepo;

  constructor (offerRepo: IOfferRepo) {
    this.offerRepo = offerRepo
  }

  public async execute (request: AcceptOfferDTO): Promise<Result<Offer>> {
    const { offerId } = request;
    const offer = this.offerRepo.findById(offerId);

    if (!!offer === false) {
      return Result.fail<Offer>(ErrorType.NOT_FOUND)
    }

    // Creates the domain event
    offer.acceptOffer();

    // Persists the offer and dispatches all created domain events
    this.offerRepo.save(offer);
    
    return Result.ok<Offer>(offer)
  }
}
```

### Class Invariant - Value Object
What shape is my data allowed to take? Below, a latitude object can only be between -90 and 90 degrees.

```typescript
import { ValueObject } from '../../../core/valueObject';
import { Result, TypedResult } from '../../../core/result';

export interface ILatitude {
  value: number;
}

export class Latitude extends ValueObject<ILatitude> {
  value: number;
  
  private constructor (props: ILatitude) {
    super(props);
    this.value = props.value
  }

  // Factory method
  // The latitude must be a number between -90 and 90
  public static create (latitude: ILatitude) : TypedResult<Latitude> {
    if (latitude.value < -90 || latitude.value > 90) {
      return Result.typedFail<Latitude>("Latitude must be within -90 and 90")
    }
    return Result.typedOk<Latitude>(new Latitude(latitude))
  }
}
```

### Concrete classes

In TypeScript- we actually CAN create objects directly from interfaces. We can do things like this:

`const khalil: Person = { name: 'Khalil', age: 23 }`

```typescript
```


```typescript
 * A concrete Stratocaster guitar class. 
 */

class Stratocaster {
  private color: string;
  constructor (color: string) {
    this.color = color;
  }

  // Actual sound a guitar makes
  play () {
    console.log('do-dee-do-do-drnrnr')
  }
}

/**
 * The musician plays a guitar. 
 */

class Musician {
  // We've specified that this musician HAS to play
  // a Stratocaster... so they can't even play a Jazzmaster
  // if they wanted to 😢
  private guitar: Stratocaster;

  // Inject a Stratocaster into the constructor.
  // Clearly we've missed an abstraction here.
  constructor (guitar: Stratocaster) {
    this.guitar = guitar;
  }
} 
```

```typescript
abstract class Guitar {
  private color: string;
  public pedals: IPedal[];
  private currentVolume: Volume;
  private currentTone: ITone;

  constructor (color: string, pedals: IPedal[] = []) {
    this.color = color;
    this.pedals = pedals 
  }

  play () : void {}
  getTuning () : Tuning {}
  setTuning (newTuning: Tuning) : void {}
  getVolumn () : Volume {}
  setVolume (newVolume: Volume) : void {}
  getTone () : ITone {}
  setTone (newTone: ITone) : void {}
  plugIn () : void {}
  isPluggedIn () : boolean;
  isAtMaxVolume () : boolean;
  getConnectedPedals () : IPedal[]
  connectPedal (pedal: IPedal) : void {}
  getGuitarInfo () : IGuitarMetaData {}
  changeStrings (strings: IStrings) : void {}
  ...
}

// Stratocaster has access to all of the properties and methods
// of guitar, defined in one place.
class Stratocaster extends Guitar {
  constructor (color: string) {
    super(color, [])
  }
}

// Jazzmaster does too!
class Jazzmaster extends Guitar {
  constructor (color: string) {
    super(color, [])
  }
}
```