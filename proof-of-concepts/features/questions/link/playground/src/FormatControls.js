const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
];

export const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          onClick={props.onClick}
          style={type.style}
        />
      ))}
    </div>
  );
};

export function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Inline Code', style: 'CODE' },
  { label: 'Strikethrough', style: 'STRIKETHROUGH' }
];

export const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          onClick={props.onClick}
          style={type.style}
        />
      ))}
    </div>
  );
};

export function StyleButton(props) {
  const onToggle = (e) => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  const onClick = (e) => {
    e.preventDefault();
    props.onClick();
  };

  let className = 'RichEditor-styleButton';
  if (props.active) {
    className += ' RichEditor-activeButton';
  }
  return (
    <span className={className} onMouseDown={onToggle} onClick={onClick}>
      {props.label}
    </span>
  );
}

// Custom overrides for "code" style.
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

// add code tag to inline code
// code {
//     padding: .2em .4em;
//     margin: 0;
//     font-size: 85%;
//     background-color: var(--color-neutral-muted);
//     border-radius: 6px;
// }

// tt, code {
//     font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
// }
