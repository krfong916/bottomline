import React from 'react';
describe('bottomline ask a question', () => {
  test('a submitted form must not be empty', () => {});
  test('title must not be null', () => {});
  test('title must be at least characters', () => {});

  test('body must not be null', () => {});
  test('body must be at least 30 characters', () => {});

  test('tags must not be null', () => {});
  test('a single tag cannot be more than 35 characters', () => {});
});

// only after the user's first attempt to submit the form -
// show field level errors
// when they attempt to fix the issue, onblur, validate the field

// on first submit the form is checked
// errors are shown

// now when input is changed and corrected, we check
// title is missing
// title must be at least 15 characters.
// body is missing
// body must be at least 30 characters long, you entered 7.
//
// the tag '' is too long the maximum length is 35 characters.
//
//
// please enter at least one tag
// your question couldn't be submitted. please see errors above
//
// red is removed when the minimum has been reached
//
// store a draft on the users localStorage
//
// link-editor
// - when the user clicks on the toolbar icon, a link editor pops up on the current caret position if
// - when the editor is over a link, and the user clicks the toolbar icon, a link editor pops up on the caret position and has the information of the link pre-filled and the range of text is highlighted
// - when the editor is opened, the editor receives focus, clicking or focusing outside of the editor closes the editor
// - when the caret is over a link, the link information is present
// - a valid url must be provided to create a link
// - escape closes the link editor if it's open
//
// answer your own question feature: create
// tags and tag information: create, read
// questions: create
// relevant questions: read; title of posts with some info of number of answers, when it was asked and by whom, with a small excerpt of the question body
//
// questions: read
// upvote, downvote: create, read, update, destory
//
