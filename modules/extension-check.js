import path from "path";

const extensionCheck = (url) => {
    const fileExtension = path.extname(url).toLowerCase();
    const extensions = [".png", ".jpg", ".jpeg", ".gif"];
    return extensions.indexOf(fileExtension) !== -1;
};

export default extensionCheck;
