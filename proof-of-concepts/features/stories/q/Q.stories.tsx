import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Q from './Q';
export default {
  title: 'Example/Q',
  component: Q,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Q>;

export const Mockup: ComponentStory<typeof Q> = (args) => {
  return <Q />;
};
