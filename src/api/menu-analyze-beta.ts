import {
  IMenuSalesOverallReq,
  IMenuSalesOverallRes,
  IOrderRawDataExportReq,
  IMenuSalesDetailReq,
  IMenuSalesDetailRes,
  IMenuSalesParentReq,
  IMenuSalesParentRes,
} from '@InterfaceFarm/menu-analyze-beta';
import { BoV3Request } from '.';

// 전체 메뉴 판매 현황 조회
export const fetchMenuSalesOverall = async (params?: IMenuSalesOverallReq) => {
  const response = await BoV3Request.get<IResponse<IMenuSalesOverallRes>>(
    '/analytics/menu/sales/overall',
    {
      params,
    }
  );

  return response.data.data;
};

// 주문 RAW 데이터 내보내기
export const exportOrderRawData = async (params?: IOrderRawDataExportReq) => {
  const response = await BoV3Request.get(
    '/analytics/menu/sales/export/order_raw_data',
    {
      params,
      responseType: 'blob',
    }
  );

  return response.data;
};

// 하위 메뉴 판매 현황 조회
export const fetchMenuSalesChild = async (
  menuMasterIdx: number,
  params?: IMenuSalesDetailReq
) => {
  const response = await BoV3Request.get<IResponse<IMenuSalesDetailRes>>(
    `/analytics/menu/sales/child/${menuMasterIdx}`,
    {
      params,
    }
  );

  return response.data.data;
};

// 상위 주메뉴 판매 현황 조회
export const fetchMenuSalesParent = async (
  menuMasterIdx: number,
  params?: IMenuSalesParentReq
) => {
  const response = await BoV3Request.get<IResponse<IMenuSalesParentRes>>(
    `/analytics/menu/sales/parent/${menuMasterIdx}`,
    {
      params,
    }
  );

  return response.data.data;
};
