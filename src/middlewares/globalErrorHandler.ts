import { NextFunction, Request, Response } from "express"

function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;



    res.status(statusCode)
    res.json({
        message: errorMessage,
        error: errorDetails
    })
}

export default errorHandler;