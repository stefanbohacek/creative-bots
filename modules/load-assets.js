import fs from 'fs';

const loadAssets = async () => await fs.readFile("./.glitch-assets", "utf8");

export default loadAssets;
