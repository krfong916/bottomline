import { BottomlineTag } from '../tags/TagEditor/types';
export type QuestionProps = {
  onSubmit?: (...args: any) => any;
  tagsEndpoint?: string;
  markdown?: string;
};
export type Question = {
  title?: string;
  body?: string;
  tags?: BottomlineTag[];
};

export type QuestionError = {
  title?: string;
  body?: string;
  tags?: string[] | string;
};
