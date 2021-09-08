import { RedisAbstractClient } from '../implementations/redisAbstractClient';
import redis from 'redis-mock';
jest.mock('redis', () => redis);

describe('Redis Usage Test', () => {
  let testService;
  beforeAll(() => {
    let redisClient = redis.createClient();
    class TestService extends RedisAbstractClient {
      constructor(client) {
        super(client);
      }
    }
    testService = new TestService(redisClient);
  });

  test('We can store something', async () => {
    await testService.put('a', 'b');
    const item = await testService.get('a');
    expect(item).toEqual('b');
  });

  test('Finds a motherfuckin thing', async () => {
    await testService.put('a', 'b');
    const item = await testService.findOne('a');
    expect(item).toEqual(true);
  });
});

export abstract class RedisAbstractClient {
  // can be accessed using their derived classes
  protected client: any;
  constructor(client) {
    this.client = client;
  }

  /**
   * Put a bitch in
   * @type {Generic} inferred by typechecker
   */
  public async put<KeyType>(key: KeyType, value: any): Promise<boolean> {
    try {
      return new Promise((resolve, reject) => {
        this.client.set(key, value, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Get a bitch out
   * @type {Generic} inferred by typechecker
   */
  public async get<KeyType>(key: KeyType): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.client.get(key, (err, value) => {
          if (err) {
            reject(err);
          }
          resolve(value);
        });
      });
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  /**
   * Find a motherfuckin thing
   * @type {Generic} inferred by typechecker
   */
  public async findOne<KeyType>(key: KeyType): Promise<boolean> {
    try {
      return new Promise((resolve, reject) => {
        this.client.get(key, (err) => {
          if (err) {
            reject(err);
          }
          resolve(true);
        });
      });
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

import app from '../../../../app';
// mock client requests
import supertest from 'supertest';
// mock client requests
import session from 'express-session';
// Redis API
import { RedisAbstractClient } from '../implementations/redisAbstractClient';
// Leverage Redis API to create an Authentication Service
import { RedisAuthService } from '../implementations/redisAuthService';
// mock Redis
import redis from 'redis-mock';
jest.mock('redis', () => redis);
// Defines session storage for Redis
let RedisStore = require('connect-redis')(session);
// Create
let redisClient = redis
  .createClient
  //   process.env.BOTTOMLINE_REDIS_PORT,
  //   process.env.BOTTOMLINE_REDIS_HOST,
  ();

// console.log(process.env.BOTTOMLINE_REDIS_PORT);

// We have js bindings to access Redis
// We create a client for the Session Storage
// The client contains configuration information so we connect to the correct session store

describe('Redis Authentication Service', () => {
  let request, authService;
  beforeAll(() => {
    app.listen(3001);
    request = supertest(app);
    authService = new RedisAuthService(redisClient);
  });

  test('Add a session when the user logs in', () => {
    // authService.findSession();
  });

  test('Check if a session exists on request', () => {});
  test('Delete a session on logout', () => {});
  test('Delete expired sessions', () => {});
});

import * as Express from 'express-session';
import { IAuthService } from '../authService';
import { RedisAbstractClient } from './redisAbstractClient';

export class RedisAuthService extends RedisAbstractClient implements IAuthService {
  constructor(client: any) {
    super(client);
  }

  public async findSession(session: Express.Session): Promise<boolean> {
    return await this.findOne(session.id);
  }

  public async addSession(session: Express.Session): Promise<boolean> {
    return await this.put(session.id, session);
  }

  // public async getSession(session: Express.Session): Promise<Express.Session> {}

  // public async extendExpirationOfSession(): Promise<void> {}
  // public async deleteSession(): Promise<void> {}
}
