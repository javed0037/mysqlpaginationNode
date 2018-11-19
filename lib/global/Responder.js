module.exports = {
    apiResponder: (req, res, message, code, error, data, token) => {
        console.log(token);
        return res.json({
            message: message,
            code: code,
            error: error,
            data: data,
            token: token
        });
    }
};