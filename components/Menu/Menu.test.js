import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Menu from './index';

it('should render Menu', () => {
  const { getByText } = render(<Menu />);
  expect(getByText('Home')).toBeInTheDocument();
});


