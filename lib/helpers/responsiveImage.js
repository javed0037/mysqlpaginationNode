const path = require('path');
const Jimp = require('jimp');


module.exports = (req, res, next) => {
    let uploadFolder = path.join(__dirname, '../../uploads');
    try {
        if (req.file) {
            // Upload single file
            let file = req.file;

            var isImage = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.filename);
            if (!isImage) {
                throw new Error('Not a valid image!');
            }

            saveResponsive(file);
        }

        if (req.files) {
            // upload multiple files
            req.files.forEach(i => {
                var isImage = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(i.filename);
                if (!isImage) {
                    throw new Error('Not a valid image!');
                }

                saveResponsive(i);
            })
        }

        next();
    } catch (error) {
        res.json(error.message);
    }

    function saveResponsive(file) {
        let filePath = path.join(uploadFolder, getUploadPath(file));
        let filename = file.filename;
        let ext = path.extname(filename);

        Jimp.read(filePath, (err, lenna) => {
            if (err) throw err;

            let newFileName500 = filePath.replace(ext, '_500' + ext);
            lenna
                .resize(500, Jimp.AUTO)
                .write(newFileName500);

            let newFileName250 = filePath.replace(ext, '_250' + ext);
            lenna
                .resize(250, Jimp.AUTO)
                .write(newFileName250);
        });
    }
}