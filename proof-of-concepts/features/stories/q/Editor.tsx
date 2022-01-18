import React, { KeyboardEvent } from 'react';
import { ContentBlock, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { Tooltip } from '@chakra-ui/react';
import {
  BoldOutlinedIcon,
  ItalicOutlinedIcon,
  StrikethroughOutlinedIcon,
  InlineCode,
  Heading,
  OrderedListOutlinedIcon,
  UnorderedListOutlinedIcon,
  DoubleQuotes,
  TableOutlinedIcon,
  FileImageOutlinedIcon
} from './assets/Icons';

export interface EditorIconProps {
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
  // ariaLabel: string;
  label: string;
  children: React.ReactNode;
}

let INLINE_STYLE_FORMAT_CONTROLS = [
  {
    label: 'Bold',
    ariaLabel: 'Format text with a Bold Outline',
    style: 'BOLD',
    component: BoldOutlinedIcon
  },
  {
    label: 'Italic',
    ariaLabel: 'Format text with an Italic Emphasis',
    style: 'ITALIC',
    component: ItalicOutlinedIcon
  },
  {
    label: 'Inline Code',
    ariaLabel: 'Format text as an inline snippet of code',
    style: 'CODE',
    component: InlineCode
  },
  {
    label: 'Strikethrough',
    ariaLabel:
      'Format text with a Strikethrough, a horizontal line through the center of text',
    style: 'STRIKETHROUGH',
    component: StrikethroughOutlinedIcon
  }
];

export function InlineStyleControls(props) {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <React.Fragment>
      {INLINE_STYLE_FORMAT_CONTROLS.map((formatControl) => (
        <FormatControl
          label={formatControl.label}
          key={formatControl.label}
          active={currentStyle.has(formatControl.style)}
          onToggle={props.onToggle}
          style={formatControl.style}
          ariaLabel={formatControl.ariaLabel}
        >
          {formatControl.component()}
        </FormatControl>
      ))}
    </React.Fragment>
  );
}

function FormatControl(props) {
  const onToggle = (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  let className = 'format-option';
  if (props.active) {
    className += ' format-option-active';
  }

  return (
    <button
      type="button"
      aria-label={props.ariaLabel}
      className={className}
      onMouseDown={onToggle}
    >
      {props.children}
    </button>
  );
}

let BLOCK_STYLE_FORMAT_CONTROLS = [
  {
    label: 'Heading',
    ariaLabel: 'Format text as a title',
    style: 'header-one',
    component: Heading
  },
  {
    label: 'Quote Block',
    ariaLabel: 'Format text as a quote block',
    style: 'blockquote',
    component: DoubleQuotes
  },
  {
    label: 'Bullet Point List',
    ariaLabel: 'Format text as a bullet point list',
    style: 'unordered-list-item',
    component: UnorderedListOutlinedIcon
  },
  {
    label: 'Numbered List',
    ariaLabel: 'Format text as a numbered list',
    style: 'ordered-list-item',
    component: OrderedListOutlinedIcon
  },
  {
    label: 'Table',
    ariaLabel: 'Insert a table',
    style: null,
    component: TableOutlinedIcon
  },
  {
    label: 'Add an Image',
    ariaLabel: 'Add an image',
    style: null,
    component: FileImageOutlinedIcon
  }
];

export function BlockStyleControls(props) {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  // console.log(blockType);
  return (
    <React.Fragment>
      {BLOCK_STYLE_FORMAT_CONTROLS.map((formatControl) => (
        <FormatControl
          label={formatControl.label}
          key={formatControl.label}
          onToggle={props.onToggle}
          active={formatControl.style === blockType}
          style={formatControl.style}
          ariaLabel={formatControl.ariaLabel}
        >
          {formatControl.component()}
        </FormatControl>
      ))}
    </React.Fragment>
  );
}

export const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  },
  LINK: {
    color: '#189AEF',
    textDecoration: 'underline'
  },
  HIGHLIGHT_LINK: {
    backgroundColor: 'rgba(172,206,247, 0.8)'
  },
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  },
  blockquote: {
    background: 'colors.$Gray-2',
    'background-color': 'colors.$Gray-2',
    'border-left': '5px solid colors.$Gray-4',
    color: '#666',
    'font-family':
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    'font-style': 'italic',
    margin: '16px 0',
    padding: '10px 20px'
  }
};

export function blockStyleFn(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'bottomline-editor__blockquote';
  }
}

export function bottomlineEditorKeyBindingFn(e: KeyboardEvent): string | null {
  const { hasCommandModifier } = KeyBindingUtil;
  if (e.keyCode === 66 && hasCommandModifier(e)) {
    return 'bold';
  }
  if (e.keyCode === 75 && hasCommandModifier(e)) {
    return 'link';
  }
  if (e.keyCode === 73 && hasCommandModifier(e)) {
    return 'italic';
  }
  if (e.keyCode === 222 && e.shiftKey && hasCommandModifier(e)) {
    return 'blockquote';
  }
  if (e.keyCode === 56 && e.shiftKey && hasCommandModifier(e)) {
    return 'bulleted-list';
  }
  if (e.keyCode === 55 && e.shiftKey && hasCommandModifier(e)) {
    return 'numbered-list';
  }
  if (e.keyCode === 13 && e.shiftKey) {
    return 'newline';
  }
  if (e.keyCode === 8 || e.keyCode === 46) {
    return 'backspace';
  }
  return getDefaultKeyBinding(e);
}
