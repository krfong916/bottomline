import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tag, TagIcon, TagCloseButton } from './Tag';
import { TagEditor } from './TagEditor/TagEditor';
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
  return <Tag size={size} type={type} text={text} />;
};

const IconTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'Add a friend', type, orientation } = args;
  const onClick = () => console.log('Custom icon with custom click event listener');
  // tag with an icon
  // tag with left and right support
  return (
    <Tag size={size} type={type} text={text}>
      <TagIcon orientation={orientation}>
        <GoPlus style={{ height: '100%', cursor: 'pointer' }} />
      </TagIcon>
    </Tag>
  );
};

const CloseButtonTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'material-analysis', type } = args;
  return (
    <Tag size={size} type={type} text={text}>
      <TagCloseButton />
    </Tag>
  );
};

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

const UseCaseTemplate: ComponentStory<typeof Tag> = (args) => {
  return (
    <div>
      <TagEditor />
      <button>Review Your Question</button>
    </div>
  );
};

export const UseCase = UseCaseTemplate.bind({});
