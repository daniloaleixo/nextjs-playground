import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Layout from './index';

it('should render Layout', () => {
  const { getByText } = render(<Layout />);
  expect(getByText('Home')).toBeInTheDocument();
});