import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
      receivedData: req.body
    });
  }
  
  next();
};