// interface for bookmarks in localStorage

import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

const bookmarkDefaults = [
    {stopID:"2389",stop_code:"2389",intersection:"Monroe at Leonard",direction:"Eastbound"},
    {stopID:"1100",stop_code:"1100",intersection:"E Mifflin at N Pinckney",direction:"Westbound"},
    {stopID:"1509",stop_code:"1509",intersection:"Williamson at S Blount",direction:"Eastbound"}
  ];

function BookmarkProvider({ children }) {
    const [bookmarks, setBookmarksState] = useState(getBookmarks());
  
    function getBookmarks() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        if (!bookmarks) {
            return bookmarkDefaults;
        } else {
            return bookmarks;
        }
    }
    
    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);
  
    const setBookmarks = (stopList) => {
        if (!Array.isArray(stopList)) {
            console.log('ERROR: stop list needs to be a list');
        } else {
            // never let the user remove the last bookmark. if the 
            // list is empty, inject the defaults
            if( stopList.length === 0 ) {
                stopList = bookmarkDefaults;
            }
            setBookmarksState(stopList);
        }
    };
  
    return (
      <BookmarkContext.Provider value={{ bookmarks, setBookmarks }}>
        {children}
      </BookmarkContext.Provider>
    );
}
  
function useBookmarks() {
  return useContext(BookmarkContext);
}

export { BookmarkProvider, useBookmarks };
