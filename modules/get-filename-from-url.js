const getFilenameFromURL = (url) => url.substring(url.lastIndexOf("/") + 1);

export default getFilenameFromURL;
