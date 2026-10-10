import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkProvider, useBookmarks } from './bookmarks';

// A helper component to read and write bookmarks in the test
function BookmarkTestComponent() {
  const { bookmarks, setBookmarks } = useBookmarks();
  return (
    <div>
      <div data-testid="bookmarks-length">{bookmarks.length}</div>
      <div data-testid="first-bookmark">{bookmarks[0]?.stopID}</div>
      <button
        onClick={() => setBookmarks([{ stopID: "9999", stop_code: "9999", intersection: "Test", direction: "Northbound" }])}
      >
        Set One Bookmark
      </button>
      <button onClick={() => setBookmarks([])}>Clear Bookmarks</button>
    </div>
  );
}

describe('BookmarkProvider and useBookmarks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides default bookmarks when localStorage is empty', () => {
    render(
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
    );

    expect(screen.getByTestId('bookmarks-length').textContent).toBe('3');
    expect(screen.getByTestId('first-bookmark').textContent).toBe('2389');
  });

  test('loads bookmarks from localStorage', () => {
    const customBookmarks = [
      { stopID: '1234', stop_code: '1234', intersection: 'Custom Stop', direction: 'Southbound' }
    ];
    localStorage.setItem('bookmarks', JSON.stringify(customBookmarks));

    render(
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
    );

    expect(screen.getByTestId('bookmarks-length').textContent).toBe('1');
    expect(screen.getByTestId('first-bookmark').textContent).toBe('1234');
  });

  test('updates bookmarks and saves to localStorage', () => {
    render(
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
    );

    fireEvent.click(screen.getByText('Set One Bookmark'));

    expect(screen.getByTestId('bookmarks-length').textContent).toBe('1');
    expect(screen.getByTestId('first-bookmark').textContent).toBe('9999');

    const stored = JSON.parse(localStorage.getItem('bookmarks'));
    expect(stored).toHaveLength(1);
    expect(stored[0].stopID).toBe('9999');
  });

  test('restores defaults when attempting to clear all bookmarks', () => {
    render(
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
    );

    // First make it 1 bookmark
    fireEvent.click(screen.getByText('Set One Bookmark'));
    expect(screen.getByTestId('bookmarks-length').textContent).toBe('1');

    // Clear it
    fireEvent.click(screen.getByText('Clear Bookmarks'));

    // Should inject defaults
    expect(screen.getByTestId('bookmarks-length').textContent).toBe('3');
    expect(screen.getByTestId('first-bookmark').textContent).toBe('2389');
  });
});
