import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const RawHeaders = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
               
        return req.rawHeaders;
    }
);

//!OJO: Hasta ahora solo se uso como ejemplo de custom decorators "BORRAR"!!!!