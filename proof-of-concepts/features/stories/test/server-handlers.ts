import 'whatwg-fetch';
import { rest } from 'msw';
import { tags } from './bottomline-data';

const delay = 0;

const handlers = [
  rest.get('http://localhost:3000/tags', async (req, res, ctx) => {
    const query = req.url.searchParams;
    const like = query.get('like');
    return res(ctx.delay(delay), ctx.status(200), ctx.json(tags));
  })
];

export { handlers };
