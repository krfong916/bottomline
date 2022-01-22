export type TagEditorProps = {
  onTagsChanged?: (tags: BottomlineTag[]) => void;
  name?: string;
  onBlur?: (args: any) => any;
  onFocus?: (args: any) => any;
  onChange?: (args: any) => any;
  endpoint?: string;
  ariaDescribedBy: string;
  ariaLabelledBy: string;
};
export type BottomlineTag = {
  id?: string;
  name: string;
  count?: number;
  excerpt?: string;
};

export type BottomlineTags = Record<string, BottomlineTag>;
