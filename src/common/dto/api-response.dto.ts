export class ApiResponseDto<T = any> {
  statusCode!: number;
  message!: string;
  data?: T;
  errors?: any;
}