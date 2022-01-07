import React from 'react';
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
  CodeOutlinedIcon,
  TableOutlinedIcon,
  FileImageOutlinedIcon
} from './assets/Icons';

export interface EditorIconProps {
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  label: string;
  children: React.ReactNode;
}

export const WithHover = React.forwardRef(
  (
    { ariaLabel, label, ...props }: EditorIconProps,
    ref: React.LegacyRef<HTMLButtonElement>
  ) => {
    return (
      <Tooltip label={label} fontSize="sm" placement="top" hasArrow>
        <span {...props} ref={ref} aria-label={ariaLabel}>
          {props.children}
        </span>
      </Tooltip>
    );
  }
);

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
  return (
    <React.Fragment>
      {INLINE_STYLE_FORMAT_CONTROLS.map((formatControl) => (
        <WithHover
          label={formatControl.label}
          ariaLabel={formatControl.ariaLabel}
          className="format-option"
          key={formatControl.label}
        >
          <InlineFormatControl
            label={formatControl.label}
            key={formatControl.label}
            onToggle={props.onToggle}
          >
            {formatControl.component()}
          </InlineFormatControl>
        </WithHover>
      ))}
    </React.Fragment>
  );
}

function InlineFormatControl(props) {
  const onToggle = (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.onToggle();
  };
  return <div onMouseDown={onToggle}>{props.children}</div>;
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
    label: 'Code Block',
    ariaLabel: 'Format text as a block of code',
    style: 'code-block',
    component: CodeOutlinedIcon
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
  return (
    <React.Fragment>
      {BLOCK_STYLE_FORMAT_CONTROLS.map((formatControl) => (
        <WithHover
          label={formatControl.label}
          ariaLabel={formatControl.ariaLabel}
          className="format-option"
          key={formatControl.label}
        >
          <BlockFormatControl
            label={formatControl.label}
            key={formatControl.label}
            onToggle={props.onToggle}
            active={formatControl.style === blockType}
            style={formatControl.style}
          >
            {formatControl.component()}
          </BlockFormatControl>
        </WithHover>
      ))}
    </React.Fragment>
  );
}

function BlockFormatControl(props) {
  return <React.Fragment>{props.children}</React.Fragment>;
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
  }
};
