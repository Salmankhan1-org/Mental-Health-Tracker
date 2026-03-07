const Log = require("../../../models/log.model");

const LogController = async (request, relation, status, message, content={}) => {
    try {
        const log = await Log.create({
            relation: relation,
            email: request.body?.email,
            internetProtocolAddress: request.headers["x-forwarded-for"] || request.connection.remoteAddress,
            status: status,
            message: message,
            content: content
        });

        if(log?._id){
            return {
                code: 200,
                success: true,
                error: [],
                message: "Log added successfully."
            };
        }
        else {
            return {
                code: 200,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "No log added for given operation."
                    }
                ],
                message: ""
            };
        }
    }
    catch (error){
        return {
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "No log added for given operation."
                }
            ],
            message: ""
        };
    }
}

module.exports = LogController;