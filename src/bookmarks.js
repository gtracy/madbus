// interface for bookmarks in localStorage

import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

const bookmarkDefaults = [
    {stopID:"100",stop_code:"0100",intersection:"University & N Park",direction:"Westbound"},
    {stopID:"1100",stop_code:"1100",intersection:"E Mifflin & N Pinckney",direction:"Westbound"},
    {stopID:"1505",stop_code:"1505",intersection:"Jenifer & S Ingersoll",direction:"Eastbound"},
    {stopID:"1878",stop_code:"1878",intersection:"Jenifer & S Ingersoll",direction:"Westbound"}
  ];

function BookmarkProvider({ children }) {
    const [bookmarks, setBookmarksState] = useState(getBookmarks());
  
    function getBookmarks() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        console.dir('getBookmarks: ' + bookmarks);
        if (!bookmarks) {
            //setBookmarksState(bookmarkDefaults);
            console.log('... returning defaults');
            return bookmarkDefaults;
        } else {
            return bookmarks;
        }
    }
    
    useEffect(() => {
        console.log('BookmarkProvider: '+bookmarks.length);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);
  
    const setBookmarks = (stopList) => {
        if (!Array.isArray(stopList)) {
            console.log('ERROR: stop list needs to be a list');
        } else {
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
