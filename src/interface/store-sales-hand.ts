// 매출 수기입력 관련 인터페이스

// 매출 수기입력 리스트 조회 요청 인터페이스
export interface ISalesKeyinListReq {
  per_num?: number;
  current_num?: number;
  sales_day_start?: string;
  sales_day_finish?: string;
  store_idx?: string;
  data_sync_status?: number;
  search_target?: string;
  search_keyword?: string;
}

// 매출 수기입력 리스트 아이템 인터페이스
export interface ISalesKeyinListItem {
  store_idx: number;
  store_name: string;
  receipt_count: number;
  sales_amount: number;
}

// 매출 수기입력 리스트 그룹 아이템 인터페이스
export interface ISalesKeyinGroupItem {
  sales_keyin_group_idx: number;
  sales_day: string;
  sales_keyin_count: number;
  sales_keyin_list: ISalesKeyinListItem[];
  total_receipt_count: number;
  total_sales_amount: number;
  registrant_idx: number;
  registrant_name: string;
  registration_date: string;
  modifier_idx: number | null;
  modifier_name: string | null;
  modification_date: string | null;
  data_sync_status: number;
  data_sync_date: string | null;
}

// 매출 수기입력 리스트 조회 응답 인터페이스
export interface ISalesKeyinListRes {
  request_info: ISalesKeyinListReq;
  result_count: number;
  result_list: ISalesKeyinGroupItem[];
}

// 매출 수기입력 등록/수정 요청 인터페이스
export interface ISalesKeyinCreateReq {
  sales_day: string;
  sales_keyin_list: {
    store_idx: string;
    receipt_count: string;
    sales_amount: string;
  }[];
}

// 매출 수기입력 등록/수정/삭제/데이터반영 응답 인터페이스
export interface ISalesKeyinActionRes {
  sales_keyin_group_idx: number;
}

// 매출 수기입력 상세 조회 응답 인터페이스
export interface ISalesKeyinDetailRes {
  sales_keyin_group_idx: number;
  sales_day: string;
  sales_keyin_list: ISalesKeyinListItem[];
  data_sync_status: number;
  data_sync_date: string | null;
}

// 템플릿 리스트 조회 요청 인터페이스
export interface ISalesKeyinTemplateListReq {
  per_num?: number;
  current_num?: number;
  search_target?: string;
  search_keyword?: string;
}

// 템플릿 매장 리스트 아이템 인터페이스
export interface ISalesKeyinTemplateStoreItem {
  store_idx: number;
  store_name: string;
}

// 템플릿 리스트 아이템 인터페이스
export interface ISalesKeyinTemplateListItem {
  sales_keyin_template_idx: number;
  template_name: string;
  store_count: number;
  store_list: ISalesKeyinTemplateStoreItem[];
  registrant_idx: number;
  registrant_name: string;
  registration_date: string;
  modifier_idx: number | null;
  modifier_name: string | null;
  modification_date: string | null;
}

// 템플릿 리스트 조회 응답 인터페이스
export interface ISalesKeyinTemplateListRes {
  request_info: ISalesKeyinTemplateListReq;
  result_count: number;
  result_list: ISalesKeyinTemplateListItem[];
}

// 템플릿 등록/수정 요청 인터페이스
export interface ISalesKeyinTemplateCreateReq {
  template_name: string;
  store_idx_list: number[];
}

// 템플릿 등록/수정/삭제 응답 인터페이스
export interface ISalesKeyinTemplateActionRes {
  sales_keyin_template_idx: number;
}

// 템플릿 상세 조회 응답 인터페이스
export interface ISalesKeyinTemplateDetailRes {
  sales_keyin_template_idx: number;
  template_name: string;
  store_count: number;
  store_list: ISalesKeyinTemplateStoreItem[];
}
