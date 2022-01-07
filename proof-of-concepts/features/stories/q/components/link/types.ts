import { EditorState, SelectionState } from 'draft-js';
import { ComponentProps } from '../../../types';
export type LinkState = {
  linkSelection?: SelectionState | null;
  textSelection?: SelectionState | null;
  showDetails: boolean;
  showEditor: boolean;
  url: string;
  text: string;
  coords?: LinkCoordinates;
};

export type LinkProps = {
  editorState: EditorState;
  editorSetState: React.Dispatch<EditorState>;
} & ComponentProps<LinkState, LinkActionAndChanges>;

export interface LinkCoordinates {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

export enum LinkEditorStateChangeTypes {
  LINK_CLOSE_DETAILS = '[link_editor_close_details]',
  CLOSE_EDITOR = '[link_editor_close_editor]',
  CLOSE_DETAILS = '[link_editor_close_details]',
  REMOVE_LINK = '[link_editor_remove_link]',
  UPDATE_LINK = '[link_editor_update_link]',
  OPEN_EDITOR_BY_LINK_DETAILS = '[link_editor_open_editor_by_link_details]',
  OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_TEXT = '[link_editor_open_editor_control_for_text]',
  OPEN_DETAILS = '[link_editor_open_details]',
  OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_LINK = '[link_editor_open_editor_control_for_link]'
}

export type LinkAction = {
  type: LinkEditorStateChangeTypes;
  editorState?: EditorState;
  linkRange?: [number, number];
  textRange?: [number, number];
  hasText?: boolean;
};

export type LinkActionAndChanges = {};
