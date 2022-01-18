export type Question = {
  title?: string;
  body?: string;
  tags?: string[];
};

export type QuestionError = {
  title?: string;
  body?: string;
  tags?: string[] | string;
};
