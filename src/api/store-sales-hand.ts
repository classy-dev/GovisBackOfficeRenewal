import {
  ISalesKeyinListReq,
  ISalesKeyinListRes,
  ISalesKeyinCreateReq,
  ISalesKeyinActionRes,
  ISalesKeyinDetailRes,
  ISalesKeyinTemplateListReq,
  ISalesKeyinTemplateListRes,
  ISalesKeyinTemplateCreateReq,
  ISalesKeyinTemplateActionRes,
  ISalesKeyinTemplateDetailRes,
} from '@InterfaceFarm/store-sales-hand';
import { BoV3Request } from '.';

// 매출 수기입력 리스트 조회
export const fetchSalesKeyinList = async (params?: ISalesKeyinListReq) => {
  const response = await BoV3Request.get<IResponse<ISalesKeyinListRes>>(
    '/sales_keyin',
    {
      params,
    }
  );

  return response.data.data;
};

// 매출 수기입력 등록
export const fetchCreateSalesKeyin = async (params: ISalesKeyinCreateReq) => {
  const response = await BoV3Request.post<IResponse<ISalesKeyinActionRes>>(
    '/sales_keyin',
    params
  );

  return response.data.data;
};

// 매출 수기입력 상세 조회
export const fetchSalesKeyinDetail = async (sales_keyin_group_idx: number) => {
  const response = await BoV3Request.get<IResponse<ISalesKeyinDetailRes>>(
    `/sales_keyin/${sales_keyin_group_idx}`
  );

  return response.data.data;
};

// 매출 수기입력 수정
export const fetchUpdateSalesKeyin = async (
  sales_keyin_group_idx: number,
  params: ISalesKeyinCreateReq
) => {
  const response = await BoV3Request.put<IResponse<ISalesKeyinActionRes>>(
    `/sales_keyin/${sales_keyin_group_idx}`,
    params
  );

  return response.data.data;
};

// 매출 수기입력 삭제
export const fetchDeleteSalesKeyin = async (sales_keyin_group_idx: number) => {
  const response = await BoV3Request.delete<IResponse<ISalesKeyinActionRes>>(
    `/sales_keyin/${sales_keyin_group_idx}`
  );

  return response.data.data;
};

// 매출 수기입력 데이터 반영
export const fetchSyncSalesKeyin = async (sales_keyin_group_idx: number) => {
  const response = await BoV3Request.post<IResponse<ISalesKeyinActionRes>>(
    `/sales_keyin/data_sync/${sales_keyin_group_idx}`
  );

  return response.data.data;
};

// 템플릿 리스트 조회
export const fetchSalesKeyinTemplateList = async (
  params?: ISalesKeyinTemplateListReq
) => {
  const response = await BoV3Request.get<IResponse<ISalesKeyinTemplateListRes>>(
    '/sales_keyin/template',
    {
      params,
    }
  );

  return response.data.data;
};

// 템플릿 등록
export const fetchCreateSalesKeyinTemplate = async (
  params: ISalesKeyinTemplateCreateReq
) => {
  const response = await BoV3Request.post<
    IResponse<ISalesKeyinTemplateActionRes>
  >('/sales_keyin/template', params);

  return response.data.data;
};

// 템플릿 상세 조회
export const fetchSalesKeyinTemplateDetail = async (
  sales_keyin_template_idx: any
) => {
  const response = await BoV3Request.get<
    IResponse<ISalesKeyinTemplateDetailRes>
  >(`/sales_keyin/template/${sales_keyin_template_idx}`);

  return response.data.data;
};

// 템플릿 수정
export const fetchUpdateSalesKeyinTemplate = async (
  sales_keyin_template_idx: number,
  params: ISalesKeyinTemplateCreateReq
) => {
  const response = await BoV3Request.put<
    IResponse<ISalesKeyinTemplateActionRes>
  >(`/sales_keyin/template/${sales_keyin_template_idx}`, params);

  return response.data.data;
};

// 템플릿 삭제
export const fetchDeleteSalesKeyinTemplate = async (
  sales_keyin_template_idx: number
) => {
  const response = await BoV3Request.delete<
    IResponse<ISalesKeyinTemplateActionRes>
  >(`/sales_keyin/template/${sales_keyin_template_idx}`);

  return response.data.data;
};
