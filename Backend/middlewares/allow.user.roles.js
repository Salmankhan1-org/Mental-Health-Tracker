exports.AllowUserRole = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request?.user?.role)) {
      return response.status(403).json({
        statusCode: 403,
        success: 403,
        error:[
            {
                field: 'popup',
                message: 'Access Denied For Your Role'
            }
        ],
        message: ''
      })
    }
    next()
  }
}