import { describe } from 'node:test';
import { Login } from './routes/login';
import { renderApp } from './testing/test-utils';
import { screen } from '@testing-library/react';

describe('Login page', () => {
  it('meow', () => {
    renderApp(<Login />);
    screen.debug();
  });
});
