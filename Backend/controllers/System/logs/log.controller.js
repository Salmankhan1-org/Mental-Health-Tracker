const Log = require("../../../models/system/log.model");

const LogController = async (request={}, relation, status, message, content={}) => {
    try {
        const email =
        request?.body?.email ||
        request?.email ||
        request?.user?.email ||
        null;

        const ip =
        request?.headers?.["x-forwarded-for"] ||
        request?.connection?.remoteAddress ||
        "system";
        const log = await Log.create({
            relation: relation,
            email: email,
            internetProtocolAddress: ip,
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