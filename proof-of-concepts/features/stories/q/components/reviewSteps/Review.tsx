import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { RiNumber1, RiNumber2 } from 'react-icons/ri';
import './Review.scss';
import { useFormState } from 'react-final-form';

const ReviewMessage = () => {
  const { submitFailed, hasValidationErrors, errors } = useFormState();
  let numErrors = errors ? Object.keys(errors).length : 0;
  let reviewMessage = '';

  if (numErrors === 0) {
    reviewMessage = 'Your question is ready for posting';
  } else if (numErrors === 1) {
    reviewMessage = 'You have 1 error';
  } else {
    reviewMessage = `You have ${numErrors} errors`;
  }
  return hasValidationErrors ? <span>{`${reviewMessage}`}</span> : null;
};

export function Review() {
  return (
    <div className="review-container">
      <h2 className="review-header">Step 1: Draft Your Question</h2>
      <span className="review-header__info">
        The community is here to answer questions that you have about organizing,
        historical events, and radical left theory and politics.
      </span>
      <Accordion allowToggle className="review-section-container">
        <AccordionItem className="review-section">
          <AccordionButton className="review-section__button">
            <RiNumber1 />
            <Box className="review-section__title">Summarize your problem</Box>
            <HiOutlineChevronDown className="review-section__toggle-button" />
          </AccordionButton>
          <AccordionPanel>
            <span>
              Provide any background detail and context necessary for understanding
              the question you’re asking.
            </span>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className="review-section">
          <AccordionButton className="review-section__button">
            <RiNumber2 />
            <Box className="review-section__title">Show some context or research</Box>
            <HiOutlineChevronDown className="review-section__toggle-button" />
          </AccordionButton>
          <AccordionPanel>
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
                understand it. This helps others be on the same page as you.
              </li>
            </ul>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
