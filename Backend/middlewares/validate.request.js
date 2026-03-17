const { validationResult } = require("express-validator");

exports.Validate = (req, res, next) => {

  const errors = validationResult(req);

  const errorArray = errors.array();

  if (!errors.isEmpty()) {
    return res.status(400).json({
		statusCode: 400,
		success: false,
		error:[
			{
				type: errorArray[0].field,
				message: errorArray[0].msg
			}
		],
		message: "Validation failed"
    });
  }

  next();
};