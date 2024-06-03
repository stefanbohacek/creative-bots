const splitText = (text, length) => {
  const temp = text.split(' ').reduce((acc, c) => {
    const currIndex = acc.length - 1;
    const currLen = acc[currIndex].join(' ').length;
    if (currLen + c.length > length) {
      acc.push([c]);
    } else {
      acc[currIndex].push(c);
    }
    return acc;
  }, [[]]);
  
  return temp.map(arr => arr.join(' '));
};

export default splitText;