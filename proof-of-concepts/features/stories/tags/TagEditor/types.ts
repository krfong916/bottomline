export type TagEditorProps = {
  onTagsChanged?: (tags: BottomlineTag[]) => void;
  name?: string;
  onBlur?: (args: any) => any;
  onFocus?: (args: any) => any;
  onChange?: (args: any) => any;
};
export type BottomlineTag = {
  id?: string;
  name: string;
  count?: number;
  excerpt?: string;
};

export type BottomlineTags = Record<string, BottomlineTag>;
