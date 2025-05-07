// 메뉴 카테고리 관리

// 메뉴 카테고리 목록 요청
export interface IMenuCategoryListReq {
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  display_hidden_data?: string;
}

// 메뉴 카테고리 인터페이스
export interface IMenuCategory {
  menu_category_idx: number;
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_name: string;
  display_sort_number: number;
  is_hide: 0 | 1;
}

// 메뉴 카테고리 목록 응답
export interface IMenuCategoryListRes {
  request_info: {
    menu_classification: string;
    display_hidden_data: string | null;
  };
  result_list: IMenuCategory[];
}

// 메뉴 카테고리 등록 요청 인터페이스
export interface IMenuCategoryCreateReq {
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_name: string;
  is_hide: 0 | 1;
}

// 메뉴 카테고리 등록/수정 응답 인터페이스
export interface IMenuCategoryCreateRes {
  menu_category_idx: number;
}

// 메뉴 카테고리 조회 요청
export interface IMenuCategoryGetReq {
  menu_category_idx: number;
}

// 메뉴 카테고리 조회 응답
export interface IMenuCategoryGetRes {
  menu_category_idx: number;
  menu_classification: string;
  menu_category_name: string;
  is_hide: 0 | 1;
}

// 메뉴 카테고리 수정 요청 인터페이스
export interface IMenuCategoryUpdateReq {
  menu_category_name: string;
  is_hide: 0 | 1;
}

export interface IMenuCategoryUpdateRes {
  menu_category_idx: number;
}

// 메뉴 카테고리 정렬 변경 요청 인터페이스
export interface IMenuCategorySortReq {
  sort_change_list: {
    menu_category_idx: number;
    display_sort_number: number;
  }[];
}

// 메뉴 마스터 관리

// 메뉴 마스터 목록 요청 인터페이스
export interface IMenuMasterListReq {
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_idx?: number;
  search_target?: string;
  search_keyword?: string;
  display_hidden_data?: string;
}

// 메뉴 마스터 목록 응답 인터페이스

// 메뉴 마스터 인터페이스
export interface IMenuMaster {
  menu_master_idx: number;
  menu_code: string;
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_idx: number;
  menu_category_name: string;
  menu_image: string;
  menu_name: string;
  menu_description: string;
  is_hide: 0 | 1;
}

export interface IMenuMasterListRes {
  request_info: {
    menu_classification: string;
    menu_category_idx: string | null;
    search_target: string | null;
    search_keyword: string | null;
    display_hidden_data: string | null;
  };
  result_list: IMenuMaster[];
}

// 메뉴 마스터 등록 요청 인터페이스
export interface IMenuMasterCreateReq {
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_idx: number;
  menu_image?: string;
  menu_name: string;
  menu_description?: string;
  is_hide: 0 | 1;
}

// 메뉴 마스터 등록 응답 인터페이스
export interface IMenuMasterCreateRes {
  menu_master_idx: number;
  menu_code: string;
}

// 메뉴 마스터 조회 응답 인터페이스
export interface IMenuMasterGetRes extends IMenuMaster {}

// 메뉴 마스터 수정 요청 인터페이스
export interface IMenuMasterUpdateReq {
  menu_category_idx: number;
  menu_image?: string;
  menu_name: string;
  menu_description?: string;
  is_hide: 0 | 1;
}

// 메뉴 마스터 수정 응답 인터페이스
export interface IMenuMasterUpdateRes {
  menu_master_idx: number;
}

// 매장별 메뉴 관리

// 매장 목록 요청 인터페이스
export interface IStoreSoldMenuListReq {
  store_menu_sales_type?: 'GENERAL' | 'FLAGSHIP';
  search_target?: string;
  search_keyword?: string;
}

// 매장 메뉴 요약 인터페이스
export interface IStoreSoldMenuSummary {
  store_idx: number;
  store_name: string;
  store_menu_sales_type: 'GENERAL' | 'FLAGSHIP';
  linked_menu_count: number;
  unlinked_menu_count: number;
  pending_menu_count: number;
}

// 매장 메뉴 목록 응답 인터페이스
export interface IStoreSoldMenuListRes {
  request_info: {
    store_menu_sales_type: string | null;
    search_target: string | null;
    search_keyword: string | null;
  };
  result_list: IStoreSoldMenuSummary[];
}

// 매장 메뉴 상세 조회 응답 인터페이스
export interface ISoldMenu {
  store_sold_menu_idx: number;
  sold_menu_name: string;
}

export interface ILinkedMenuCategory {
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_name: string;
  menu_name: string;
  sold_menu_list: ISoldMenu[];
}

export interface IStoreSoldMenuDetailRes {
  store_idx: number;
  store_name: string;
  store_menu_sales_type: 'GENERAL' | 'FLAGSHIP';
  unlinked_menu_count: number;
  unlinked_menu_list: ISoldMenu[];
  linked_menu_count: number;
  linked_menu_list: ILinkedMenuCategory[];
  pending_menu_count: number;
  pending_menu_list: ISoldMenu[];
}

// 판매된 메뉴 조회 응답 인터페이스.
export interface ILinkExpectedMenu {
  menu_master_idx: number;
  menu_classification: 'GENERAL' | 'FLAGSHIP' | 'PROMOTION';
  menu_category_name: string;
  menu_name: string;
}

export interface ISoldMenuDetailRes {
  store_sold_menu_idx: number;
  store_name: string;
  store_menu_sales_type: 'GENERAL' | 'FLAGSHIP';
  sold_menu_name: string;
  link_status: 0 | 1 | 9;
  link_expected_menu_list: ILinkExpectedMenu[];
}

// 판매된 메뉴 연결 처리 요청 인터페이스
export interface ISoldMenuLinkProcessingReq {
  store_sold_menu_idx: number;
  menu_master_idx: number;
  is_batch_processing?: string;
}

// 판매된 메뉴 연결 처리 응답 인터페이스
export interface ISoldMenuLinkProcessingRes {
  store_sold_menu_idx: number;
}

// 메뉴 보류 처리 요청 인터페이스
export interface IMenuPendingProcessingReq {
  store_sold_menu_idx: number;
  is_batch_processing?: string;
}

// 메뉴 보류 처리 응답 인터페이스
export interface IMenuPendingProcessingRes {
  store_sold_menu_idx: number;
}
