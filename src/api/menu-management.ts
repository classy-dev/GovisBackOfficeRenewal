import {
  IMenuCategoryListReq,
  IMenuCategoryListRes,
  IMenuCategoryCreateReq,
  IMenuCategoryCreateRes,
  IMenuCategoryUpdateReq,
  IMenuCategoryUpdateRes,
  IMenuCategorySortReq,
  IMenuMasterListReq,
  IMenuMasterListRes,
  IMenuMasterCreateReq,
  IMenuMasterCreateRes,
  IMenuMasterGetRes,
  IMenuMasterUpdateReq,
  IMenuMasterUpdateRes,
  IStoreSoldMenuListReq,
  IStoreSoldMenuListRes,
  IStoreSoldMenuDetailRes,
  ISoldMenuDetailRes,
  ISoldMenuLinkProcessingReq,
  ISoldMenuLinkProcessingRes,
  IMenuPendingProcessingReq,
  IMenuPendingProcessingRes,
} from '@InterfaceFarm/menu-management';
import { IResponse } from '@InterfaceFarm/response';
import { BoV3Request } from '.';

// 메뉴 카테고리 목록
export const fetchMenuCategoryList = async (params: IMenuCategoryListReq) => {
  const response = await BoV3Request.get<IResponse<IMenuCategoryListRes>>(
    '/menu/category',
    { params }
  );
  return response.data.data;
};

// 메뉴 카테고리 등록
export const fetchCreateMenuCategory = async (data: IMenuCategoryCreateReq) => {
  const response = await BoV3Request.post<IResponse<IMenuCategoryCreateRes>>(
    '/menu/category',
    data
  );
  return response.data.data;
};

// 메뉴 카테고리 조회
export const fetchMenuCategory = async (menuCategoryIdx: number) => {
  const response = await BoV3Request.get<IResponse<IMenuCategoryUpdateRes>>(
    `/menu/category/${menuCategoryIdx}`
  );
  return response.data.data;
};

// 메뉴 카테고리 수정
export const fetchUpdateMenuCategory = async (
  menuCategoryIdx: number,
  data: IMenuCategoryUpdateReq
) => {
  const response = await BoV3Request.put<IResponse<IMenuCategoryUpdateRes>>(
    `/menu/category/${menuCategoryIdx}`,
    data
  );
  return response.data.data;
};

// 메뉴 카테고리 정렬 변경
export const fetchUpdateMenuCategorySort = async (
  data: IMenuCategorySortReq
) => {
  const response = await BoV3Request.put<IResponse<void>>(
    '/menu/category/display_sort_number',
    data
  );
  return response.data.data;
};

// 메뉴 마스터 목록
export const fetchMenuMasterList = async (params: IMenuMasterListReq) => {
  const response = await BoV3Request.get<IResponse<IMenuMasterListRes>>(
    '/menu/master',
    { params }
  );
  return response.data.data;
};

// 메뉴 마스터 등록
export const fetchCreateMenuMaster = async (data: IMenuMasterCreateReq) => {
  const response = await BoV3Request.post<IResponse<IMenuMasterCreateRes>>(
    '/menu/master',
    data
  );
  return response.data.data;
};

// 메뉴 마스터 조회
export const fetchMenuMaster = async (menuMasterIdx: number) => {
  const response = await BoV3Request.get<IResponse<IMenuMasterGetRes>>(
    `/menu/master/${menuMasterIdx}`
  );
  return response.data.data;
};

// 메뉴 마스터 수정
export const fetchUpdateMenuMaster = async (
  menuMasterIdx: number,
  data: IMenuMasterUpdateReq
) => {
  const response = await BoV3Request.put<IResponse<IMenuMasterUpdateRes>>(
    `/menu/master/${menuMasterIdx}`,
    data
  );
  return response.data.data;
};

// 매장 판매 메뉴 목록
export const fetchStoreSoldMenuList = async (params: IStoreSoldMenuListReq) => {
  const response = await BoV3Request.get<IResponse<IStoreSoldMenuListRes>>(
    '/store_sold_menu/store',
    { params }
  );
  return response.data.data;
};

// 매장 조회 (판매된 메뉴 목록)
export const fetchStoreSoldMenuDetail = async (storeIdx: number) => {
  const response = await BoV3Request.get<IResponse<IStoreSoldMenuDetailRes>>(
    `/store_sold_menu/store/${storeIdx}`
  );
  return response.data.data;
};

// 판매된 메뉴 조회
export const fetchSoldMenuDetail = async (storeSoldMenuIdx: number) => {
  const response = await BoV3Request.get<IResponse<ISoldMenuDetailRes>>(
    `/store_sold_menu/sold_menu/${storeSoldMenuIdx}`
  );
  return response.data.data;
};

// 판매된 메뉴 연결 처리
export const fetchLinkSoldMenu = async (data: ISoldMenuLinkProcessingReq) => {
  const response = await BoV3Request.post<
    IResponse<ISoldMenuLinkProcessingRes>
  >('/store_sold_menu/sold_menu/link_processing', data);
  return response.data.data;
};

// 메뉴 보류 처리
export const fetchPendingMenuProcessing = async (
  data: IMenuPendingProcessingReq
) => {
  const response = await BoV3Request.post<IResponse<IMenuPendingProcessingRes>>(
    `/store_sold_menu/sold_menu/pending_processing`,
    data
  );
  return response.data.data;
};
