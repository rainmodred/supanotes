import { describe } from 'node:test';
import { Login, action } from './login';
import { renderApp } from '../../testing/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublicRoute } from '../../components/public-route';

describe('LoginRoute', () => {
  it.skip('should validate fields', async () => {
    const user = userEvent.setup();
    renderApp(
      <PublicRoute>
        <Login />
      </PublicRoute>,
      {
        path: '/login',
        url: '/login',
        action,
      },
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
      'test@example',
    );
    await user.click(
      screen.getByRole('button', {
        name: /login/i,
      }),
    );

    expect(
      screen.getByRole('alert', {
        name: /invalid email/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('alert', {
        name: /password must be at least 6 characters/i,
      }),
    ).toBeInTheDocument();
  });

  it.skip('do something', async () => {
    const user = userEvent.setup();
    renderApp(
      <PublicRoute>
        <Login />
      </PublicRoute>,
      {
        path: '/login',
        url: '/login',
        action,
      },
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
      'test@example.com',
    );

    await user.type(screen.getByLabelText(/password/i), '123456');
    await user.click(
      screen.getByRole('button', {
        name: /login/i,
      }),
    );
  });
});
