/**
 * 日期时间工具函数
 * 提供中国时间相关的日期处理功能
 */

/**
 * 获取当前中国时间的日期字符串 (YYYY-MM-DD格式)
 * 避免UTC时间导致的日期偏移问题
 * 
 * @returns {string} 格式为 YYYY-MM-DD 的日期字符串
 * 
 * @example
 * // 中国时间 2025-08-06 06:00:00
 * getCurrentChinaDate() // '2025-08-06'
 * 
 * // 避免了 UTC 时间问题
 * // new Date().toISOString().split('T')[0] 在早上8点前可能返回前一天
 */
export const getCurrentChinaDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 将Date对象格式化为中国时间日期字符串 (YYYY-MM-DD格式)
 * 使用本地时间，避免UTC转换问题
 * 
 * @param {Date} date - 要格式化的Date对象
 * @returns {string} 格式为 YYYY-MM-DD 的日期字符串
 * 
 * @example
 * const date = new Date('2025-08-06T10:30:00');
 * formatDateToChinaString(date) // '2025-08-06'
 */
export const formatDateToChinaString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 获取昨天的中国时间日期字符串 (YYYY-MM-DD格式)
 * 
 * @returns {string} 格式为 YYYY-MM-DD 的昨天日期字符串
 * 
 * @example
 * // 当前中国时间 2025-08-06
 * getYesterdayChinaDate() // '2025-08-05'
 */
export const getYesterdayChinaDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToChinaString(yesterday);
};

/**
 * 检查给定日期是否为今天（中国时间）
 * 
 * @param {string} dateString - 要检查的日期字符串 (YYYY-MM-DD格式)
 * @returns {boolean} 如果是今天返回true，否则返回false
 * 
 * @example
 * isToday('2025-08-06') // 如果今天是2025-08-06则返回true
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getCurrentChinaDate();
};

/**
 * 检查给定日期是否为昨天（中国时间）
 * 
 * @param {string} dateString - 要检查的日期字符串 (YYYY-MM-DD格式)
 * @returns {boolean} 如果是昨天返回true，否则返回false
 * 
 * @example
 * isYesterday('2025-08-05') // 如果今天是2025-08-06则返回true
 */
export const isYesterday = (dateString: string): boolean => {
  return dateString === getYesterdayChinaDate();
};