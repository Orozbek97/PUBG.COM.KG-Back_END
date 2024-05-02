const ApiError = require('../exceptions/api-error');


module.exports =  function (err, req, res, next) {
    console.log(err)
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    if (err.code === 550) {
        return res.status(550).json({ message: 'Ошибка с кодом 550'});
    }
    return res.status(500).json({message: 'Непредвиденная ошибка'})


}