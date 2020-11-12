const ResponseFactory = () => {
    return {
        on: async (event, callback) => {
            await callback("request successful");
        },
        statusCode: 200
    }
}

module.exports = ResponseFactory