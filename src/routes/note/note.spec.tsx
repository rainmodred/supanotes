import { supabase } from '@/lib/supabase';
import {
  createFakeNote,
  createFakeTag,
  createFakeUser,
  db,
} from '@/testing/mocks/db';
import { renderApp } from '@/testing/test-utils';
import { drop } from '@mswjs/data';
import userEvent from '@testing-library/user-event';
import { Note, loader as noteLoader, action as noteAction } from './note';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { queryClient } from '@/lib/react-query';
import { faker } from '@faker-js/faker';

describe('NoteRoute', () => {
  beforeEach(() => {
    const user = createFakeUser();
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: {
        session: {
          user: {
            id: user.id,
          },
        },
      },
    });

    vi.spyOn(supabase.auth, 'onAuthStateChange').mockReturnValue({
      data: {
        subscription: {
          id: '1',
          callback: () => {},
          unsubscribe: () => {},
        },
      },
    });
  });

  afterEach(() => {
    drop(db);
    // vi.resetAllMocks();
    vi.clearAllMocks();
    vi.useRealTimers();
  });
  it('should change title', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const note = createFakeNote();
    const user = userEvent.setup();
    renderApp(<Note />, {
      path: `/notes/:noteId`,
      url: `/notes/${note.id}`,
      loader: noteLoader(queryClient),
      action: noteAction(queryClient),
    });

    const input = await screen.findByPlaceholderText('title');
    const spinner = screen.getByTestId('loading');

    const text = faker.lorem.word();
    await user.clear(input);
    await user.type(input, text);
    act(() => vi.runAllTimers());

    await waitFor(() => expect(spinner).toHaveClass('animate-spin'));
    await waitFor(() => expect(spinner).not.toHaveClass('animate-spin'));

    expect(input).toHaveValue(text);
  });

  it('should change body', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const note = createFakeNote({ body: 'meow' });
    const user = userEvent.setup();
    renderApp(<Note />, {
      path: `/notes/:noteId`,
      url: `/notes/${note.id}`,
      loader: noteLoader(queryClient),
      action: noteAction(queryClient),
    });

    const textbox = await screen.findByText('meow');
    const spinner = screen.getByTestId('loading');

    const text = faker.lorem.words(5);
    await user.clear(textbox);
    await user.type(textbox, text);
    act(() => vi.runAllTimers());

    await waitFor(() => expect(spinner).toHaveClass('animate-spin'));
    await waitFor(() => expect(spinner).not.toHaveClass('animate-spin'));

    expect(textbox).toHaveValue(text);
  });

  it('should create, select and unselect tag', async () => {
    //sometimes fails
    const fakeTag = createFakeTag();

    const note = createFakeNote();
    const user = userEvent.setup();
    const { container } = renderApp(<Note />, {
      path: '/notes/:noteId',
      url: `/notes/${note.id}`,
      loader: noteLoader(queryClient),
      action: noteAction(queryClient),
    });

    const input = await screen.findByRole('combobox');
    const spinner = screen.getByTestId('loading');
    await user.clear(input);
    fireEvent.focus(input);
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.click(screen.getByRole('option', { name: fakeTag.name }));
    expect(await screen.findByTestId('loading')).toHaveClass('animate-spin');
    await waitFor(() => expect(spinner).not.toHaveClass('animate-spin'));

    // //click outside to close a tags selector
    await user.click(document.body);
    expect(screen.getByText(fakeTag.name)).toBeInTheDocument();

    //remove tag button
    await user.click(container.querySelector('.ml-1.rounded-full'));
    expect(spinner).toHaveClass('animate-spin');
    await waitFor(() => expect(spinner).not.toHaveClass('animate-spin'));

    expect(
      screen.queryByRole('option', { name: fakeTag.name }),
    ).not.toBeInTheDocument();

    const meow = 'meow';
    await user.type(input, meow);
    await user.click(screen.getByText(/create/i));
    expect(screen.getByText(meow)).toBeInTheDocument();
  });

  it('should delete note', async () => {
    const note = createFakeNote();
    renderApp(<Note />, {
      path: `/notes/:noteId`,
      url: `/notes/${note.id}`,
      loader: noteLoader(queryClient),
      action: noteAction(queryClient),
    });

    const deleteButton = await screen.findByTestId('delete-note');
    // await user.click(deleteButton);
    fireEvent.click(deleteButton);
    fireEvent.click(
      screen.getByRole('button', {
        name: /confirm/i,
      }),
    );

    // await user.click(
    //   screen.getByRole('button', {
    //     name: /confirm/i,
    //   }),
    // );
    expect(screen.queryByText(note.title)).not.toBeInTheDocument();
  });
});
