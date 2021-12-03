export type TagEditorProps = {
  onTagsChanged?: (tags: BottomlineTag[]) => void;
};
export type BottomlineTag = {
  id?: string;
  name: string;
  count?: number;
  excerpt?: string;
};

export type BottomlineTags = Record<string, BottomlineTag>;
