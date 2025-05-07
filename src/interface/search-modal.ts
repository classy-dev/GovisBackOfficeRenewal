import { Dispatch, SetStateAction } from 'react';
import { checkedItemType } from '@ComponentFarm/modal/SearchPopup/SearchPopup';

// 제품상세설정 팝업
export interface IProductSearchModalReq {
  evi_product_status?: number;
  evi_product_category?: number;
  search_target?: string;
  search_keyword?: string;
}

interface IProductSearchModalResItem {
  product_info_idx: number;
  product_code: string;
  evi_product_category: number;
  evi_product_category_str: string;
  product_name_ko: string;
  product_name_en: string;
  evi_product_status: number;
  evi_product_status_str: string;
  created_date: string;
}

export interface IProductSearchModalRes {
  info: IProductSearchModalReq;
  list: IProductSearchModalResItem[];
}

// 매장상세설정 팝업
export interface IStoreModalReq {
  store_idx?: number | string;
  region?: string;
  commercial_area?: string;
  store_type?: string;
  search_target?: string;
  search_keyword?: string;
}

interface IStoreSearchModalResItem {
  store_idx: number;
  store_name: string;
  region: string;
  commercial_area: string;
  store_type: string;
  store_status: string;
  open_date: string;
  sv_user_name: string;
}

export interface IStoreModalRes {
  info: IProductSearchModalReq;
  list: IStoreSearchModalResItem[];
}

export interface IMenuSearchModalReq {
  per_num?: number;
  current_num?: number;
  evi_menu_group?: number;
  evi_menu_status?: number;
  evi_menu_type?: number;
  evi_menu_classification?: number;
  menu_category_idx?: number;
  search_target?: string;
  search_keyword?: string;
  sort_target?: string;
  sort_type?: string;
}

interface IMenuSearchModalResItem {
  menu_info_idx: number;
  menu_code: string;
  evi_menu_group: number;
  evv_menu_group: string;
  evi_menu_type: number;
  evv_menu_type: string;
  evi_menu_classification: number;
  evv_menu_classification: string;
  menu_category_idx: number;
  menu_category_name: string;
  menu_name: string;
  evi_menu_status: number;
  evv_menu_status: string;
}

export interface IMenuSearchModalRes {
  info: IMenuSearchModalReq;
  list: IMenuSearchModalResItem[];
}

// productSearch, storeSearch
export interface ISearcPopupProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  initialValues: string[];
  type?: 'radio' | 'checkbox' | string;
  selectItems: checkedItemType[];
  setSelectItems: Dispatch<SetStateAction<checkedItemType[]>>;
  filters: {
    [key: string]: string | null;
  };
  setFilters: Dispatch<
    SetStateAction<{
      [key: string]: string | null;
    }>
  >;
}

// 메뉴마스터
export interface IMenuMasterReq {
  menu_classification?: string;
  menu_category_idx?: number;
  search_target?: string;
  search_keyword?: string;
  display_hidden_data?: string;
}

interface IMenuMasterResItem {
  menu_master_idx: number;
  menu_code: string;
  menu_classification: string;
  menu_category_idx: number;
  menu_category_name: string;
  menu_image: string | null;
  menu_name: string;
  menu_description: string | null;
  is_hide: number;
}

export interface IMenuMasterRes {
  request_info: IMenuMasterReq;
  result_count: number;
  result_list: IMenuMasterResItem[];
}
