const jwt = require('jsonwebtoken');

exports.VerifyAppointmentActionToken = (request, response, next) => {
    try {
        const token = request.body.token || request.query.token;

        if (!token) {
            return response.status(401).json({
                statusCode: 401,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Token missing' 
                    }
                ],
                message: ''
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (decoded.action !== 'confirm_appointment') {
            return response.status(403).json({
                statusCode: 403,
                success: false,
                error: [
                    { 
                        field: 'popup', 
                        message: 'Invalid token action' 
                    }
                ],
                message: ''
            });
        }

        request.appointmentId = decoded.appointmentId;
        request.userId = decoded.userId;

        next();
    } catch (error) {
        return response.status(401).json({
            statusCode: 401,
            success: false,
            error: [
                { 
                    field: 'popup', 
                    message: 'Invalid or expired token' 
                }
            ],
            message: ''
        });
    }
};