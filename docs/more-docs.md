## Testing

A note about testing in our environments

- running unit tests on the local env
- and running tests (like integration tests) in the docker env
  require us to have bcrypt built from each environment's OS, and the database seeded.
  So, at times, you may need to either rebuild bcrypt from source

```sh
npm rebuild bcrypt --build-from-source
```

Or, you may need to run

```sh
docker-compose -f docker-compose.yml build
# and then
docker-compose up # to run migrations, seed the db etc.
# shut down the container
Ctrl-c
# and finally to run a full test
docker-compose -f docker-compose.yml run server npm run test
# or to develop
docker-compose -f docker-compose.yml run server npm run test:watch
```

- We run Broad Integration Tests: integration tests with a live service dependencies
- **Attention:** It may be the case that you will need to run the integration tests with a fresh, newly seeded database. If so, delete the database instance and then run tests as normal

```sh
# to view the database in your command line
psql -h localhost -p 5432 -d devDB -U dev
# recommended: pretty-print output in terminal
\x on
# an example of how to interact with the schema
SELECT * FROM "Invites";
# occasionally you may need to delete a row from a table during integration tests
DELETE from "Users" where email='krfong@ucsc.edu';
```

## Sequelize

- Creating a new table requires careful naming (plural and singular)
- Secondly, columns are automatically defined/queried when using a model. To turn them off, see docs:
  - https://sequelize.org/master/manual/model-basics.html
- removing the createdAt, updatedAt column for a table/model
  - https://github.com/sequelize/sequelize/issues/6229
  - https://stackoverflow.com/questions/39587767/disable-updatedat-update-date-field-in-sequelize-js
- To ensure hooks always runs you may need to do some gymnastics:
  - define
    - `hooks:true` to ensure hooks always runs for a given model update
    - `returning:true` returns the previous and changed data value after update
    - `plain:true` returns only the changed data value after update
    - `individualHooks:true` must specify in order to run an afterUpdate or bulk hook for a model instance
    - https://gist.github.com/zcaceres/f9b44ae18579411e57f3131654e92ce3
    - https://github.com/sequelize/sequelize/issues/6938

## Either and Result class

- Our return types use union and intersection typing in order to narrow down the response type for many of our function calls
- see: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html and https://stackoverflow.com/questions/58974640/typescript-property-does-not-exist-on-union-type

## Express

- Lightweight, make no opinions, Node.js framework.
- Terms:
  - `next()` pass control to the next matching route handler

## Why uuid and uid-safe?

- uuid for generating user ids
- uid-safe for url and cookie safe ids
