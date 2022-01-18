import React from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react';
import { FaRegThumbsUp } from 'react-icons/fa';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { RiNumber1, RiNumber2 } from 'react-icons/ri';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import './Review.scss';
import { useFormState } from 'react-final-form';

// internally, useFormState uses React.Context maintained by react-final-form
// we choose not to pass props from parent to grandchild for readability
const ReviewMessage = () => {
  const { submitFailed, hasValidationErrors, errors } = useFormState();
  let numErrors = errors
    ? Object.keys(errors).reduce((accum, key) => (errors[key] ? accum + 1 : accum), 0)
    : 0;
  let reviewMessage = '';

  if (numErrors === 0) {
    reviewMessage = 'Your question is ready for posting';
  } else if (numErrors === 1) {
    reviewMessage = 'You have 1 error';
  } else {
    reviewMessage = `You have ${numErrors} errors`;
  }

  const ErrorMessage = () => {
    return (
      <div className="review-error-container">
        <AiOutlineExclamationCircle className="review-header__error-icon" />
        <span className="review-header-result">
          Your question couldn't be submitted
        </span>
        <span className="review-header__result-resolution">
          Resolve {numErrors} issues before posting
        </span>
      </div>
    );
  };

  const NoErrors = () => {
    return (
      <div className="review-section-container">
        <FaRegThumbsUp className="review-header__no-errors-icon" />
        <span className="review-header-result">
          Your question is ready for posting
        </span>
      </div>
    );
  };

  return (
    <React.Fragment>
      <h2 className="review-header">Step 2: Review Your Question</h2>
      {submitFailed && hasValidationErrors && numErrors !== 0 ? (
        <ErrorMessage />
      ) : (
        <NoErrors />
      )}
    </React.Fragment>
  );
};
const ContentGuidelines = () => {
  return (
    <>
      <h2 className="review-header">Step 1: Draft Your Question</h2>
      <span className="guideline-header__info">
        The community is here to answer questions that you have about organizing,
        historical events, radical left theory, and left politics.
      </span>
      <Accordion allowToggle className="guideline-section-container">
        <AccordionItem className="guideline-section">
          <AccordionButton className="guideline-section__button">
            <span className="guideline-section__title-number">1.</span>
            <Box className="guideline-section__title">Summarize your problem</Box>
            <HiOutlineChevronDown className="guideline-section__toggle-button" />
          </AccordionButton>
          <AccordionPanel>
            <span className="guideline-section__info">
              Provide any background detail and context necessary for understanding
              the question you’re asking.
            </span>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className="guideline-section">
          <AccordionButton className="guideline-section__button">
            <span className="guideline-section__title-number">2.</span>
            <Box className="guideline-section__title">
              Show some context or research
            </Box>
            <HiOutlineChevronDown className="guideline-section__toggle-button" />
          </AccordionButton>
          <AccordionPanel>
            <div className="guideline-section__info">
              <span>
                You can get better answers when you provide research and context
              </span>
              <ul>
                <li>
                  When appropriate, share links or author, title, and page number to
                  content that you reference.
                </li>
                <li>
                  Clarify any terms, histories, or concepts that you use as you
                  understand them. This helps others be on the same page as you.
                </li>
              </ul>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};
export function Review({
  className,
  displayErrors,
  transitionIn
}: {
  className: string;
  displayErrors: boolean;
  transitionIn: boolean;
}) {
  const reviewContainerClassName = 'review-container ' + className;

  return (
    <div className={reviewContainerClassName}>
      <CSSTransition in={transitionIn}>
        {displayErrors ? <ReviewMessage /> : <ContentGuidelines />}
      </CSSTransition>
    </div>
  );
}
