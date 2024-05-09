const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/photos');
    },
    filename: (req, file, cb) => {
        //const name = file.originalname;
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
});

export default upload;