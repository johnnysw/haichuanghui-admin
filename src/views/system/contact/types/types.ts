export interface QuickLinkItem {
  /** 链接名称 */
  name: string;
  /** 链接地址 */
  url: string;
}

export interface ContactFormModel {
  phone: string;
  email: string;
  wechat: string;
  address: string;
  about: string;
  wechatQr: string | null;
  wechatQr2: string | null;
  quickLinks: QuickLinkItem[];
}

export interface ContactInfo extends ContactFormModel {
  /** 主键ID，可选 */
  id?: number;
  /** 创建时间，可选 */
  createdTime?: string;
  /** 更新时间，可选 */
  updatedTime?: string;
}

export type UpdateContactPayload = Partial<ContactFormModel>;

export const defaultContactForm: ContactFormModel = {
  phone: "",
  email: "",
  wechat: "",
  address: "",
  about: "",
  wechatQr: null,
  wechatQr2: null,
  quickLinks: []
};
