exports.AuthorizeAdmin = (request, response, next) => {
    try {
        if (!request.user) {
            return response.status(401).json({
                statusCode: 401,
                success: false,
                error: [
                    { 
                        field: "auth", 
                        message: "Authentication required" 
                    }
                ],
                message: ""
            });
        }

        if (request.user.role !== "admin") {
            return response.status(403).json({
                statusCode: 403,
                success: false,
                error: [
                    { 
                        field: "role", 
                        message: "Access denied. Admin privileges required." 
                    }
                ],
                message: ""
            });
        }

        next();
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: "server", 
                    message: error.message 
                }
            ],
            message: ""
        });
    }
};