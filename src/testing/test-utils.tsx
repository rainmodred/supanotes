import { AppProvider } from '@/app';
import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

export const renderApp = (
  ui: any,
  {
    url = '/',
    path = '/',
    loader,
    action,
    ...renderOptions
  }: Record<string, any> = {},
) => {
  const router = createMemoryRouter(
    [
      {
        path: path,
        element: ui,
        loader: loader,
        action: action,
      },
    ],
    {
      initialEntries: url ? ['/', url] : ['/'],
      initialIndex: url ? 1 : 0,
    },
  );

  const returnValue = {
    ...render(ui, {
      wrapper: () => {
        return (
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        );
      },
      ...renderOptions,
    }),
  };

  return returnValue;
};
