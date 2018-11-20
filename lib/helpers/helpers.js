exports.bindGlobalHelpers = () => {
    console.log("there are the global helper", global)
    global.getUploadPath = (file) => {
        return file.path.replace('uploads', '');
    }
}