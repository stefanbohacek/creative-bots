const getRandomHex = () => "#" + Math.random().toString(16).slice(2, 8).toUpperCase();

export default getRandomHex;
