import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StopList from './StopList';
import { BookmarkProvider } from '../bookmarks';

// Mock react-ga4 to prevent initialization errors
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  event: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StopList Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders default selected stop on mount', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookmarkProvider>
          <StopList handleSelection={jest.fn()} />
        </BookmarkProvider>
      </MemoryRouter>
    );

    // Initial selected stop is the first default bookmark: "2389"
    expect(screen.getByText('2389')).toBeInTheDocument();
    expect(screen.getByText('Monroe at Leonard')).toBeInTheDocument();
  });

  test('opens menu when selected stop list item is clicked', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookmarkProvider>
          <StopList handleSelection={jest.fn()} />
        </BookmarkProvider>
      </MemoryRouter>
    );

    // Click the list item to open the dropdown
    fireEvent.click(screen.getByText('2389'));

    // Should display other bookmarks in menu
    expect(screen.getByText(/1100/)).toBeInTheDocument();
    expect(screen.getByText(/1509/)).toBeInTheDocument();
  });

  test('calls handleSelection when a different stop is selected', () => {
    const handleSelectionMock = jest.fn();
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookmarkProvider>
          <StopList handleSelection={handleSelectionMock} />
        </BookmarkProvider>
      </MemoryRouter>
    );

    // Open dropdown
    fireEvent.click(screen.getByText('2389'));

    // Click on the second stop item
    fireEvent.click(screen.getByText(/1100/));

    expect(handleSelectionMock).toHaveBeenCalledWith('1100');
  });

  test('navigates to map page when Add button is clicked', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookmarkProvider>
          <StopList handleSelection={jest.fn()} />
        </BookmarkProvider>
      </MemoryRouter>
    );

    // Open dropdown
    fireEvent.click(screen.getByText('2389'));

    // Click Add button
    fireEvent.click(screen.getByText('Add'));

    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });

  test('deletes a bookmark when Delete button is clicked in edit mode', () => {
    const handleSelectionMock = jest.fn();
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookmarkProvider>
          <StopList handleSelection={handleSelectionMock} />
        </BookmarkProvider>
      </MemoryRouter>
    );

    // Open dropdown
    fireEvent.click(screen.getByText('2389'));

    // Click Edit button to toggle delete buttons
    fireEvent.click(screen.getByText('Edit'));

    // Click the delete icon of the first bookmark (which is the active stop '2389')
    const deleteSVGs = screen.getAllByTestId('DeleteIcon');
    expect(deleteSVGs.length).toBeGreaterThan(0);
    fireEvent.click(deleteSVGs[0]);

    // Deleting the active stop should trigger handleSelection with the new top bookmark (index 0: '1100')
    expect(handleSelectionMock).toHaveBeenCalledWith('1100');

    // And now our bookmark state has 2 bookmarks instead of 3
    const stored = JSON.parse(localStorage.getItem('bookmarks'));
    expect(stored).toHaveLength(2);
    expect(stored.find(b => b.stop_code === '2389')).toBeUndefined();
  });
});
