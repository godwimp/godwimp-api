import { applyDecorators, Type } from "@nestjs/common";

export const ApiSuccessResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators();
};

