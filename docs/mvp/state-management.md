Do we have to refresh the entire app every apge load?
how many pages are we building?
globally managed state or component-specific?
memoization?
SPA, MicroFE, SSR
How many actions will we need to be performing? Are we building a website builder? or something smaller? (redux may be the answer for many actions)

What kind of app are we building?

- a banking app?
- do we have to support multi-tenancy?
- can we keep state low, lift state as needed, reach for context when needed?
- do we want one thing to handle all our requests?

Types of state

- data state
  - global state: value needed in many palce throughout the application
  - server state: values fetched from server API and cached on client (maybe)
  - values scoped directly to component or descedants
- UI state (open, active, focused)
- session state (info relating to the user: username and profile)
- feedback state (loading, success, failure)
- locations state (url, history object, path, query params)

- What's better about colocating state than using reducers and having a single source?
- Strike balance between easy to follow state and consistent/clean maintainable.
- How do we handle authentication state? Or user profile state?

Ways of thinking about state in react (form ryan florence)

1. Persistent: stuff on database: context or redux
2. Implicit: tabs or combobox (product devs don't care) but its the state abstracted away from the app. Component library authors deal with this: context, cloneElement
3. Explicit: not persisted or fetched anywhere it happens when a user interacts or an effects call back to your app. for some apps it's most just for forms: useState

when line b/t explicit and implicit is blurry:

- use custom events, prop callbacks, onChange to make implicit state explicit
- controlled components, like defaultValue v value, to remove implicit state and control explicitly
- url state is implicit usually (router subscribes to it, router and link use it, the app doesn't care)
- Suspense helps manage persistent state? No, use react-query
- Pro tip: identify the type of state you're working with and the code will flow from the fingertips
-

I suppose render props are out... in favor of what now?

"Complex state unpacked"

- lot of state
- a lot of state that goes to a lot views. complex because multiple views on different trees need the same state
  - how can redux help with this?
  - normalizing state shape - keep it flat
- what state should I be in when x happens?
- a UI has a lot of features
- logic for updating the state (being more than just a trivial assignment or addition or something)
- how to handle aggregates in a store?

hooks and context v. Redux

## Redux

- Pros

  - value-add of Redux - uni-directional data flow
  - we treat like a cache for FE i.e. state management
  - action replay for debugging/development (devtools)
  - middleware

- Cons

  - Most components have to plug into state
  - boilerplate (I've experienced that, much for one api call)
  - massive global store, as app grows, more data shows outside intended component
  - fetch tied to redux - almost all data ends up there
  - the fear is: normalizing the data from a gaggle of denormalized REST endpoints. reconstructing the server database tables as a client cache
    - how can redux help with this?

- Use Cases

  - middleware: can split and do more, modify, delay dispatching actions
    - analytics: observe every action dispatched and send a copy off to an analytics server w/metadata attached
    - websocket persistent connections
      - dispatched actions can be read and sent as messages to a server
      - messsages received from servcer can be dispatched as actions

- Design Qs
  - what state goes into the store? policy

## Hooks and context

- useState and useReducer, context API passes data down the component tree

- Pros

  - serious reduction for LOC
  - data fetching and setting state in one place

- Cons

  - how does getting state to deeply nested components work?

- How is state managed in pure react?
  - how can we share state between components?

What happens if component in separate tree needs to know about x?

## React Query

- What problems does it solve?

## Large-scale apps

## Apps with lots of actions

## Next.js and SSR?

## Microfrontends

- many micro FEs - how to solve complex api call that touches many entities? what about loading? is there a micro FE component we have to wait for?

In our app, will have more people working on it. don't want mental model
will have the option to collaborate on text

Patterns for plain react

- Ryan Florence says
  - set state. pass props. repeat.
  - only have state as high up the tree as they need to be and you get perf. by default
- Manuel Bieh says
  - All the possible solutions I can think of end up being pretty similar to redux. Just look at the useReducer() API. That’s essentially Redux. Combine with Context and you mimic connect(). Add suspense and you have the SSR/data fetching part covered.
  - Ryan Florence replies: Exactly why picking redux would be weird.
  - Manuel Bieh replies: I could imagine the “next Redux” might simplify all that in an even simpler API. Global state management was possible without Redux in the past already by just using setState() and context yet people used Redux.

* One guy says
  - we used top level providers w/ context for shared state, and presentation/container patterns. consumer components would update the top level providers. one issue was separating the fetch calls into their own containers. this was the render prop era so it became very verbose
  - lots of user flows would end in a modal presentation to confirm/cancel, which meant passing the world to a modal component and having it do basically anything, which was an oversight. lastly, (this was react native), we were tied to react-navigation which forced our hand at times

Small app with no routes

- axios
- fetch inside a useEffect hook and store response in useState
- no caching, data disappears on new routes
- quick setup

Filling out a form (validation, dirty/clean states)
modals (open/close)
autosaving
handling events

# Doc

React State and Querying

- It's all about data fetching and caching
- react-query helps cache server-side data
- hooks: useReducer and useState for managing state in React components
- context helps global state
- useContext and useMemo for unnecessary re-renders?
- separate UI v server data

- useEffect
  - Goal of hooks isn't to add lifecycles to function components. The goal is to fundamentally improve the mental model for application side-effects.
  * The question is not "when does this effect run" the question is "with which state does this effect synchronize with"
  - useEffect(fn) // all state
  - useEffect(fn, []) // no state
  - useEffect(fn, [these, states])

React-specific

- Yup, use react-query for the server cache stuff and with what UI state you have left context + hooks is often as much as you need.

  - https://twitter.com/kentcdodds/status/1353757144902852613

- React libraries
  - https://www.robinwieruch.de/react-libraries

State and Querying

- display data, update it
- save data
- that's about it

- list feed
  - post (aggregate - user and post and comments)
  - comments (aggregate - user and post)
  - filters (aggregate - metadata of posts)
- data visualization
  - active filters (metadata of posts)
  - links to comments
- articles
  - contributions
- groups
  - you can sort by tag (see a group-specific, and then a topic)
  - you can see a feed of all activity related to that topic
- chat: groupchat and single chat - can add new people to conversation \*

Do we need redux?

- Typically, we've used Redux as a client-side cache for server-side data, but there are nice things to Redux - we can separate UI from logic, and handle async requests in a
- Onboarding and teaching is very simple, but boilerplate and a long process just to get something up
- Listen, right now, I don't think it's necessary. We'll add it when it is
- Q: does our app mostly depend on fetching and caching data? Do we do more than that?

  - A: It's mostly that... posts and comments are optimistic. Writing articles may need redux because it's collaborative - ok but how?
  - A: and perhaps chat ok but how?

- https://react-community-tools-practices-cheatsheet.netlify.app/state-management/overview

It's more than just saying this happened, that happened - keepin experiences atomized. It's trying to help see these experiences as shared, intertwined.
It's with the big picture in mind that we have a lot of work to do in our own organizations - and that we can organize together (and be inspired by others movements) to organize to work and live as we deserve.

- How could they have solved this problem without relying on Redux?
- https://blog.theodo.com/2019/07/how-i-ruined-my-application-performances-by-using-react-context-instead-of-redux/

- On Suspense
- do people actually use it?
- https://medium.com/@ryanflorence/the-suspense-is-killing-redux-e888f9692430

- Side-by-side of redux v react-query
- describes how redux is often used, poses alternatives to redux and why
- data fetching, caching, state invalidation
- https://dev.to/g_abud/why-i-quit-redux-1knl

- No need for redux, componetize state
- use React-Query for server state
- https://epicreact.dev/my-state-management-mistake/

React Patterns

Making React components and hooks that can be used in multiple places is not hard. What is hard is when the use cases differ. Without the right patterns, you can find yourself with a highly complex component or custom hook that requires a lot of configuration props and way too many if statements.
You should be experienced with useContext and useReducer (experience with useMemo and useCallback is a bonus).

Use Context Controllers to improve context value maintenance
Use the Compound Components Pattern to write React components that implicitly share state while giving rendering flexibility to the user
Give simple control of state updates with a State Reducer
Provide total logic control with the Controlled Props
And more!

Hooks

Use useReducer to manage state and avoid stale state bugs (and learn when it's preferable over useState)
Optimize expensive operations with useCallback
Interact with third party DOM libraries with useLayoutEffect
Learn when to use (and when not to use) useImperativeHandle and useDebugValue
Create custom hooks for complex use cases

manage state like a pro with useState.
Interact with the DOM useRef and useEffect
make HTTP requests like a boss 😎 with useEffect
Create custom hooks to organize and reuse component logic
remove tons of code: you just won't need it anymore
simplify state management: guess what, you probably don't need a library like Redux anymore
understand your application better

Performance
Lazy loading of components (this doesn’t work with SSR because React.Suspense doesn’t work with ReactDOMServer)
Memoizing context values
Code splitting
Profiling

React Query

- The argument is that server cache is not the same as state and trying to keep local state in sync with remote state can be a losing battle.
- React Query uses a stale-while-revalidating (SWR) approach, your data stays in sync, you can invalidate and it is super fast.
- This makes the sharing of state much less complicated and the local state is what it should be – UI and locally scoped.
- Custom Hooks
  - inversion of control is powerful specifically for when use cases change - allowing the user to control for their use cases
  - hooks - is built in inversion of control. Hooks allows you to take care of the UI, hooks takes care of the logic
  - move away from higher-order components and render props - use hooks
- my words: they give custom control to the user of how they want the UI to be rendered
  - State reducer pattern built on top of custom hooks
- if you have a common use case that changes the way that state is managed
- combine reducers will help

patterns that simplify your API

- reducer pattern
- control props
- hook composition
- compound components (reachUI, materialUI)

I didn’t really understand custom hooks before this. My components probably had more logic in them than they should have done. I now am much more confident at abstracting and pulling out hook based logic, making the code shareable and the components tiny and clean.

- useMemo
  I now understand why and where I’d memoize values – where it is worth thinking about and where it isn’t worth it. I’m clearer about the dependency arrays.

client with crud ops
hooks that uses these crud ops
destructure from hooks and in the component use those hooks
