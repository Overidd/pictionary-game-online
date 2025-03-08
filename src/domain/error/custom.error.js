


export class CustomError extends Error {
   statusCode;

   constructor(statusCode, message, name) {
      super(message);
      Error.captureStackTrace(this, this.constructor); // Captura el stack trace del error para que la traza de error se inicie desde CustomError y no desde Error.
      this.name = name || this.constructor.name;
      this.statusCode = statusCode;
   }

   // El usuario no envio los datos correctos
   /**
    * 
    * @param message code 400
    * @returns 
    */
   static badRequest(message) {
      return new CustomError(400, message, 'BadRequestError');
   }

   // El usuario no esta autorizado
   /**
    * 
    * @param message code 401
    * @returns 
    */
   static notAuthorized(message) {
      return new CustomError(401, message, 'NotAuthorizedError');
   }

   // el servidor denegó el acceso a un recurso solicitado por el cliente
   /**
    * 
    * @param message code 403
    * @returns 
    */
   static forbidden(message) {
      return new CustomError(403, message, 'ForbiddenError');
   }

   // El servidor no encontro el recurso
   /**
    * 
    * @param message code 404
    * @returns 
    */
   static notFound(message) {
      return new CustomError(404, message, 'NotFoundError');
   }

   /**
    * 
    * @param message code 500
    * @returns 
    */
   static internalServer(message) {
      return new CustomError(500, message, 'InternalServerError');
   }

   static fetchError(status, message) {
      switch (status) {
         case 400:
            throw CustomError.badRequest(message);
         case 401:
            throw CustomError.notAuthorized(message);
         case 403:
            throw CustomError.forbidden(message);
         case 404:
            throw CustomError.notFound(message);
         case 500:
            throw CustomError.internalServer(message);
         default:
            throw new CustomError(message);
      }
   }
} 