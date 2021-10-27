import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

/**
 *
 * On Change while popup
 *
 */

// a user should be able to type characters in the input while the dropdown is open and item is focused

// deleting all characters closes the popup
