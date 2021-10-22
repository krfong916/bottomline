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
  type: 'solid' | 'outlined' | 'no-outline';
  text: string;
  children?: React.ReactChildren;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export const Tag = ({
  size = 'small',
  type = 'outlined',
  text = '',
  onClick,
  children,
  ...props
}: TagProps) => {
  const tagContainerClass = classNames({
    tag: true,
    'tag-container': true,
    [`tag-${size}`]: true,
    [`tag-${type}`]: true
  });
  return (
    <span {...props} onClick={onClick} className={tagContainerClass}>
      {text}
      {children}
    </span>
  );
};

/********************
 *                  *
 *    Tag Icon      *
 *                  *
 ********************/
interface TagIcon {
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
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
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
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
