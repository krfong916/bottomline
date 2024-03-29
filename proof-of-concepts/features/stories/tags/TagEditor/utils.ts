// debounce hook
// useInteractOutside - to close the popup?
import { delayRandomly, delayControlled, throwRandomly } from '../../utils';
const props = {
  size: 'small',
  type: 'no-outline',
  text: '',
  orientation: 'right'
} as TagProps;

export const noop = () => {};

export function fetchTags(tag: string, url: string, getSignal: () => AbortSignal) {
  // change using env variable for url endpoint
  if (process.env.PRODUCTION) {
    // url = 'production endpoint';
  }
  return fetch(url, {
    signal: getSignal(),
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (res) => {
      // await delayControlled();
      // throwRandomly();
      return res.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function getTagAttributes(target: HTMLElement) {
  return {
    name: target.getAttribute('data-name'),
    index: parseInt(target.getAttribute('data-index')),
    tagContainer: target.getAttribute('data-container')
  };
}

export function getDuplicateTagAlert(text: string): string {
  return `Unable to create the tag "${text}", duplicate of a tag that you've already created. Text cleared, please continue typing as you were`;
}

export function isWhitespace(str: string): boolean {
  const whitespaceTest = new RegExp(/\s/);
  return whitespaceTest.test(str);
}

export function getTags(state: TagEditor): string[] {
  let tags = state.tags;
  if (tags.size === 0) return [];
  let tagsList = [];
  tags.forEach((_, tagName) => tagsList.push(tagName));
  return tagsList;
}

export function cleanText(text) {
  let regex = /[a-z]|[A-Z]|[0-9]|[\-]/g;
  let cleaned = text.match(regex);
  if (!cleaned) return '';
  const res = cleaned.join('').toLowerCase();
  return res;
}

export function isDuplicate(tagText: string, state: TagEditor): boolean {
  let tags: string[] = getTags(state);
  if (tags.length === 0) return false;
  return tags.includes(tagText);
}

export function isEmpty(text: string): boolean {
  return text === '';
}
