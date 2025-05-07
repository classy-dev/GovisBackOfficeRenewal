// 전체 메뉴 판매 현황 요청 인터페이스
export interface IMenuSalesOverallReq {
  order_dt_start?: string;
  order_dt_finish?: string;
  menu_master_idx?: string;
  store_idx?: string;
}

// 전체 메뉴 판매 현황 응답 인터페이스
export interface IMenuSalesOverallRes {
  request_info: {
    menu_master_idx: string | null;
    order_dt_start: string;
    order_dt_finish: string;
    store_idx: string | null;
  };
  result_list: {
    ranking: number;
    menu_master_idx: number;
    menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
    menu_category_name: string;
    menu_name: string;
    sum_quantity: number;
    main_quantity: number;
    option_quantity: number;
  }[];
}

// 주문 RAW 데이터 내보내기 요청 인터페이스
export interface IOrderRawDataExportReq {
  order_dt_start?: string;
  order_dt_finish?: string;
  menu_master_idx?: string;
  store_idx?: string;
}

// 메뉴 상세 판매 현황 요청 인터페이스
export interface IMenuSalesDetailReq {
  order_dt_start?: string;
  order_dt_finish?: string;
  store_idx?: string;
}

// 메뉴 상세 판매 현황 응답 인터페이스
export interface IMenuSalesDetailRes {
  request_info: {
    order_dt_start: string;
    order_dt_finish: string;
    store_idx: string | null;
    menu_master_idx: number;
    menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
    menu_category_name: string;
    menu_name: string;
  };
  result_list: {
    ranking: number;
    menu_master_idx: number;
    menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
    menu_category_name: string;
    menu_name: string;
    sum_quantity: number;
  }[];
}

// 상위 주메뉴 판매 현황 요청 인터페이스
export interface IMenuSalesParentReq {
  order_dt_start?: string;
  order_dt_finish?: string;
  store_idx?: string;
}

// 상위 주메뉴 판매 현황 응답 인터페이스
export interface IMenuSalesParentRes {
  request_info: {
    order_dt_start: string;
    order_dt_finish: string;
    store_idx: string | null;
    menu_master_idx: number;
    menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
    menu_category_name: string;
    menu_name: string;
  };
  result_list: {
    ranking: number;
    menu_master_idx: number;
    menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
    menu_category_name: string;
    menu_name: string;
    sum_quantity: number;
  }[];
}
