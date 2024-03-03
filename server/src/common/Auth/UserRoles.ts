/**
 * System roles used inside the application
 * @enum {string}
 * @readonly
 * @description System roles used inside the application
 */
export enum SystemRoles {
  /**
   * Admin role has full access to the application
   */
  ADMIN = 'ADMIN',
  /**
   * User role has limited access to the application. Can perform basic operations on the application
   */
  USER = 'USER',
}