import { ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export class CustomFileInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const interceptor = new (FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${uuid()}.${fileExtension}`;
          return cb(null, fileName);
        },
      }),
    }))();
    return interceptor.intercept(context, next);
  }
}
