// interface for bookmarks in localStorage

const bookmarkDefaults = [
    {stopid:"0100",intersection:"University & N Park",direction:"Westbound"},
    {stopid:"1100",intersection:"E Mifflin & N Pinckney",direction:"Westbound"},
    {stopid:"1505",intersection:"Jenifer & S Ingersoll",direction:"Eastbound"},
    {stopid:"1878",intersection:"Jenifer & S Ingersoll",direction:"Westbound"}
  ];
  
function setBookmarks(stop_list) {
        if( !Array.isArray(stop_list) ) {
        console.log('ERROR: stop list needs to be a list');
    } else {
        localStorage.setItem('bookmarks', JSON.stringify(stop_list));
    }
}

function getBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    console.dir('getBookmarks: '+bookmarks);
    if( !bookmarks ) {
        setBookmarks(bookmarkDefaults);
        return bookmarkDefaults;
    } else {
        return bookmarks;
    }
}

export { setBookmarks, getBookmarks };