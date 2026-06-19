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

    // Initial selected stop is the first default bookmark: "0200"
    expect(screen.getByText('0200')).toBeInTheDocument();
    expect(screen.getByText('University & East Campus')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('0200'));

    // Should display other bookmarks in menu
    expect(screen.getByText(/1787/)).toBeInTheDocument();
    expect(screen.getByText(/0010/)).toBeInTheDocument();
    expect(screen.getByText(/0201/)).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('0200'));

    // Click on the second stop item
    fireEvent.click(screen.getByText(/1787/));

    expect(handleSelectionMock).toHaveBeenCalledWith('1787');
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
    fireEvent.click(screen.getByText('0200'));

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
    fireEvent.click(screen.getByText('0200'));

    // Click Edit button to toggle delete buttons
    fireEvent.click(screen.getByText('Edit'));

    // Click the delete icon of the second bookmark
    const deleteSVGs = screen.getAllByTestId('DeleteIcon');
    expect(deleteSVGs.length).toBeGreaterThan(0);
    fireEvent.click(deleteSVGs[1]);

    // Deleting should trigger handleSelection with the new top bookmark (index 0: '0200')
    expect(handleSelectionMock).toHaveBeenCalledWith('0200');

    // And now our bookmark state has 3 bookmarks instead of 4
    const stored = JSON.parse(localStorage.getItem('bookmarks'));
    expect(stored).toHaveLength(3);
    expect(stored.find(b => b.stop_code === '1787')).toBeUndefined();
  });
});
