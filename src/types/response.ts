/** 基础响应格式 */
export interface Response<T = any> {
  code: number;
  data: T;
  message?: string;
  /** 成功标识 - 由前端计算得出 */
  success?: boolean;
}

/** 分页响应格式 */
export interface PageResponse<T = any> {
  code: number;
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
  message?: string;
}