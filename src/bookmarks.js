// interface for bookmarks in localStorage

import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

const bookmarkDefaults = [
    {stopID:"100",stop_code:"0100",intersection:"University & N Park",direction:"Westbound"},
    {stopID:"1787",stop_code:"1787",intersection:"S Pinckney & E Main",direction:"Northbound"},
    {stopID:"10",stop_code:"0010",intersection:"Langdon & N Park",direction:"Westbound"},
    {stopID:"455",stop_code:"0455",intersection:"W Johnson & N Park",direction:"Eastbound"}
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
