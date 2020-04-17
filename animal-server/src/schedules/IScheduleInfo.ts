/**
 * 定时任务基本信息
 */
export interface IScheduleInfo {
  /**
   * 定时规则
   */
  cron: string;
  /**
   * 定时任务名称
   */
  name: string;
  /**
   * 定时任务开关
   */
  switch: boolean;
}
