const logger = require('./winston');
const errorHandling = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
  
    
    if (err.isJoi) {
      statusCode = 400;
      message = err.details.map((detail) => detail.message).join(', ');
      logger.warn(`Validation Error: ${message}`);
    } else if (err.statusCode) {
     
      logger.warn(`Custom Error: ${message}`);
    } else {
      
      logger.error(`Unhandled Error: ${err.message}`);
    }
  

    logger.error(err);
  
    // Kirim respons JSON dengan detail error
    res.status(statusCode).json({
      errors: [message],
      message: statusCode === 500 ? 'Internal Server Error' : message,
      data: null,
    });
  };
  
  module.exports = errorHandling;
  