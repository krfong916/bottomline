import React from 'react';
import { Question } from '../types';
import { BottomlineTag, BottomlineTags } from '../../tags/TagEditor/types';
import { renderQuestionForm } from './utils';
import userEvent from '@testing-library/user-event';
import { createEvent } from '@testing-library/dom';
import { screen, fireEvent } from '@testing-library/react';
import { build, fake, oneOf, sequence } from '@jackfranklin/test-data-bot';
import { server, rest } from '../../test/server';

// simulate network request/mock server and response
const tagsMockEndpoint = 'http://localhost:3000/tags';

const buildTag = build<BottomlineTag>({
  fields: {
    name: oneOf(
      'materialist-theory',
      'prison-abolition',
      'east-asian-american-history'
    )
  }
});

const buildQuestionForm = build<Question>({
  fields: {
    title: 'some_random_title',
    tags: []
  },
  postBuild: (question) => {
    question.tags = Array(3)
      .fill(undefined)
      .map(() => buildTag());
    return question;
  }
});

describe('bottomline ask a question', () => {
  test('submitting the form calls onSubmit with the title, body, and tags', () => {
    const handleSubmit = jest.fn();
    const body = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const { tagsElement, titleElement, bodyElement } = renderQuestionForm({
      tagsEndpoint: tagsMockEndpoint,
      onSubmit: handleSubmit
    });

    const { title, tags } = buildQuestionForm();
    userEvent.type(titleElement, title);
    tags.forEach((tag) => {
      userEvent.type(tagsElement, tag.name);
      userEvent.type(tagsElement, '{enter}');
    });

    const event = createEvent.paste(bodyElement, {
      clipboardData: {
        types: ['text/plain'],
        getData: () => {
          return body;
        }
      }
    });

    fireEvent(bodyElement, event);
    userEvent.click(screen.getByTestId('submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({ title, body, tags });
  });

  test('omitting the title results in an error', () => {
    const handleSubmit = jest.fn();
    const body = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const { tagsElement, titleElement, bodyElement } = renderQuestionForm({
      tagsEndpoint: tagsMockEndpoint,
      onSubmit: handleSubmit
    });

    const { title, tags } = buildQuestionForm();

    // OMIT: the title
    // userEvent.type(titleElement, title);

    tags.forEach((tag) => {
      userEvent.type(tagsElement, tag.name);
      userEvent.type(tagsElement, '{enter}');
    });

    const event = createEvent.paste(bodyElement, {
      clipboardData: {
        types: ['text/plain'],
        getData: () => {
          return body;
        }
      }
    });

    fireEvent(bodyElement, event);
    userEvent.click(screen.getByTestId('submit'));
    const titleError = screen.getByText('Title is missing.');
    expect(titleError).toBeDefined();
  });
  test('omitting the body results in an error', () => {
    const handleSubmit = jest.fn();
    const body = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const { tagsElement, titleElement, bodyElement } = renderQuestionForm({
      tagsEndpoint: tagsMockEndpoint,
      onSubmit: handleSubmit
    });

    const { title, tags } = buildQuestionForm();

    userEvent.type(titleElement, title);

    tags.forEach((tag) => {
      userEvent.type(tagsElement, tag.name);
      userEvent.type(tagsElement, '{enter}');
    });

    // OMIT: the body
    // const event = createEvent.paste(bodyElement, {
    //   clipboardData: {
    //     types: ['text/plain'],
    //     getData: () => {
    //       return body;
    //     }
    //   }
    // });

    // fireEvent(bodyElement, event);

    userEvent.click(screen.getByTestId('submit'));
    const titleError = screen.getByText('Body is missing.');
    expect(titleError).toBeDefined();
  });
  test('omitting tags results in an error', () => {
    const handleSubmit = jest.fn();
    const body = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const { tagsElement, titleElement, bodyElement } = renderQuestionForm({
      tagsEndpoint: tagsMockEndpoint,
      onSubmit: handleSubmit
    });

    const { title, tags } = buildQuestionForm();

    userEvent.type(titleElement, title);

    // OMIT: tags
    // tags.forEach((tag) => {
    //   userEvent.type(tagsElement, tag.name);
    //   userEvent.type(tagsElement, '{enter}');
    // });

    const event = createEvent.paste(bodyElement, {
      clipboardData: {
        types: ['text/plain'],
        getData: () => {
          return body;
        }
      }
    });

    fireEvent(bodyElement, event);

    userEvent.click(screen.getByTestId('submit'));
    const titleError = screen.getByText('Please enter at least one tag.');
    expect(titleError).toBeDefined();
  });
});
