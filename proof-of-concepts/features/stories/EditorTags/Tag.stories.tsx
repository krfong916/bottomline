import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tag, TagLabel, TagIcon, TagCloseButton } from './Tag';
import { GoPlus } from 'react-icons/go';
export default {
  title: 'Example/Tag',
  component: Tag,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Tag>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const DefaultTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'material-analysis', type } = args;
  // solid tag with sizes
  return (
    <Tag size={size} type={type}>
      <TagLabel text={text} />
    </Tag>
  );
};

const IconTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'material-analysis', type, orientation } = args;
  const onClick = () => console.log('Custom icon with custom click event listener');
  // tag with an icon
  // tag with left and right support
  return (
    <Tag size={size} type={type}>
      <TagLabel text="Add a friend" />
      <TagIcon orientation={orientation}>
        <GoPlus style={{ height: '100%', cursor: 'pointer' }} />
      </TagIcon>
    </Tag>
  );
};

const CloseButtonTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'material-analysis', type } = args;
  return (
    <Tag size={size} type={type}>
      <TagLabel text={text} />
      <TagCloseButton />
    </Tag>
  );
};

const UseCaseTemplate: ComponentStory<typeof Tag> = (args) => {};

export const Default = DefaultTemplate.bind({});
Default.args = {
  size: 'small',
  text: 'material-analysis',
  type: 'outlined'
};

export const WithAnIcon = IconTemplate.bind({});
WithAnIcon.args = {
  orientation: 'right',
  withCustomIcon: true
};

export const WithACloseButton = CloseButtonTemplate.bind({});
WithACloseButton.args = {
  size: 'small',
  text: 'material-analysis',
  type: 'outlined',
  orientation: 'right',
  ariaLabel: 'remove'
};

export const UseCase = UseCaseTemplate.bind({});
UseCase.args = {};
