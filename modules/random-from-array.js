const randomFromArray = (arr, n) => {
  let result = arr;

  if (n) {
    result = new Array(n);
    let len = arr.length;

    if (n > len) {
      n = len;
    }

    let taken = new Array(len);

    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
  } else {
    result = arr[Math.floor(Math.random() * arr.length)];
  }
  return result;
};

export default randomFromArray;
