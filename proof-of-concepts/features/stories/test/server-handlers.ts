import 'whatwg-fetch';
import { rest } from 'msw';
import { tags } from './bottomline-data';

const delay = 0;

const handlers = [
  rest.get('http://localhost:3000/tags', async (req, res, ctx) => {
    const query = req.url.searchParams;
    const like = query.get('like');
    return res(ctx.delay(delay), ctx.status(200), ctx.json(tags));
  }),
  rest.post('https://localhost:3000/question', async (req, res, ctx) => {
    if (!req.body.title) {
      return res(ctx.status(400), ctx.json({ message: 'title required' }));
    }
    if (!req.body.body) {
      return res(ctx.status(400), ctx.json({ message: 'body required' }));
    }
    if (!req.body.tags) {
      return res(ctx.status(400), ctx.json({ message: 'tags required' }));
    }
    return res(ctx.status(201));
  })
];

export { handlers };
