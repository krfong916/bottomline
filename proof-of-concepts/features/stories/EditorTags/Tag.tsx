import React from 'react';
import classNames from 'classnames';
import { GoX } from 'react-icons/go';
import './Tag.scss';

/*******************
 *                  *
 *       Tag        *
 *                  *
 ********************/
interface TagProps {
  size: 'small' | 'medium' | 'large';
  type: 'solid' | 'outlined';
  children: React.ReactChildren;
}

export const Tag = ({
  size = 'small',
  type = 'outlined',
  children,
  ...props
}: TagProps) => {
  const tagContainerClass = classNames({
    tag: true,
    'tag-container': true,
    [`tag-${size}`]: true,
    [`tag-${type}`]: true
  });
  return <span className={tagContainerClass}>{children}</span>;
};

/*******************
 *                  *
 *    Tag Label     *
 *                  *
 ********************/
interface TagLabel {
  text: string;
  onClick?: () => void;
}

export const TagLabel = React.forwardRef<HTMLSpanElement>(
  ({ text, onClick, ...props }: TagLabel) => {
    return (
      <span className="tag-label" {...props} onClick={onClick}>
        {text}
      </span>
    );
  }
);

/********************
 *                  *
 *    Tag Icon      *
 *                  *
 ********************/
interface TagIcon {
  onClick?: () => void;
  children: React.ReactNode;
  orientation: 'left' | 'right';
  ref?: React.MutableRefObject;
}

/**
 * Puts orientation and click listener on the icon
 */
export const TagIcon = ({
  orientation,
  onClick,
  children,
  ref,
  ...props
}: TagIcon) => {
  const tagIconClass = classNames({
    'tag-icon': true,
    [`tag-icon-${orientation}`]: true
  });
  return (
    <span className={tagIconClass} ref={ref} onClick={onClick} {...props}>
      {children}
    </span>
  );
};

/***************************
 *                         *
 *     Tag Close Button    *
 *                         *
 ***************************/
interface TagCloseButtonProps {
  onClose?: () => void;
  ariaLabel?: string;
  // closeIcon?: React.ReactChildren;
  ref?: React.MutableRefObject;
}

export const TagCloseButton = ({
  ariaLabel = 'close',
  onClose,
  ref,
  ...props
}: TagCloseButtonProps) => {
  return (
    <React.Fragment>
      <button
        className="tag-close-button"
        aria-label={ariaLabel}
        ref={ref}
        onClick={onClose}
        {...props}
      >
        <GoX className="tag-close-icon" />
      </button>
    </React.Fragment>
  );
};
