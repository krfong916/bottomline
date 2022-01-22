import React from 'react';
import Q from '../Q';
import { QuestionProps } from '../types';
import { render, screen } from '@testing-library/react';

const labelId = {
  title: 'Title',
  body: 'Body',
  tags: 'Tags'
};

export function renderQuestionForm(props: QuestionProps) {
  const container = render(<Q {...props} />);

  const titleElement = screen.getByLabelText(labelId.title);
  const bodyElement = screen.getByLabelText(labelId.body);
  const tagsElement = screen.getByLabelText(labelId.tags);

  return {
    titleElement,
    tagsElement,
    bodyElement
  };
}
