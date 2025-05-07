import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from 'axios';
import { IResponse } from '../interface/response';
import { authStore } from '../mobx/store';

export interface AxiosUtilResponse<T> {
  code: string;
  data: T;
  message: string;
}

// window location 에 따른 기본 url
// 테스트
const getBaseUrl = () => {
  let reVal;
  if (process.env.DEVMODE === 'development') {
    reVal = 'https://api.gopizza.kr';
  } else {
    reVal = 'https://api.gopizza.kr';
  }

  // reVal = 'https://api.gopizza.kr';

  let host;
  if (typeof window !== 'undefined') {
    host = window.location.host;
  }

  const hostSplit = host?.split('.');

  if ((hostSplit && hostSplit[0] === 'dev') || host?.includes('vercel')) {
    reVal = 'https://dev.api.gopizza.kr';
  } else if (
    (hostSplit && hostSplit[0] === '192') ||
    (hostSplit && hostSplit[0].indexOf('localhost') >= 0) ||
    (hostSplit && hostSplit[0] === 'local')
  ) {
    reVal = 'https://api.gopizza.kr';
  }
  return reVal;
};

export const getToolBaseUrl = () => {
  let reVal = 'http://tools.gopizza.kr';

  let host;
  if (typeof window !== 'undefined') {
    host = window.location.host;
  }

  const hostSplit = host?.split('.');

  if (hostSplit && hostSplit[0] === 'dev') {
    reVal = 'https://tools.gopizza.kr';
  } else if (
    (hostSplit && hostSplit[0] === '192') ||
    (hostSplit && hostSplit[0].indexOf('localhost') >= 0) ||
    (hostSplit && hostSplit[0] === 'local')
  ) {
    reVal = 'http://dev.tools.gopizza.kr';
    // reVal = "http://feature.api.gopizza.kr";
    // reVal = "https://tools.gopizza.kr";
    // reVal = "http://192.168.0.10:8000";
  }

  return reVal;
};

// axios 기본 시간 (연결시간 지연시 aler문구 띄움)
axios.defaults.timeout = 1000 * 30;

// ApiRequest 생성
export const ApiRequest = axios.create({
  baseURL: `${getBaseUrl()}/runway/v2`,
});

// BoRequest 생성
export const BoRequest = axios.create({
  baseURL: `${getBaseUrl()}/bo/v1/`,
});

export const BoV2Request = axios.create({
  baseURL: `${getBaseUrl()}/bo/v2`,
});

export const BoV3Request = axios.create({
  baseURL: `${getBaseUrl()}/bo/v3`,
});

// Common Request 생성
export const CommonRequest = axios.create({
  baseURL: `${getBaseUrl()}/com/v2/`,
  // timeout: 3000,
});

export const CommonV3Request = axios.create({
  baseURL: `${getBaseUrl()}/com/v3/`,
  // timeout: 3000,
});

export const GcV1Request = axios.create({
  baseURL: `${getBaseUrl()}/gc/v1`,
});

export const FqsToolsRequest = axios.create({
  baseURL: getToolBaseUrl(),
});

export const FqsApiRequest = axios.create({
  baseURL: getBaseUrl(),
});

// 공통 Request
const handleRequestFullfilled = async (request: InternalAxiosRequestConfig) => {
  if (!authStore.isLoggedIn) {
    authStore.init();
  }

  // (request.headers as unknown) = {
  //   Authorization: `jwt ${String(authStore.token)}`,
  //   // Authorization: `jwt Q/aupDRJRa1klgevswkLSClrCGzvtfwGL1xfq20t5fZzA2/87YvQm/cXSD4kYw8vzu7m7bd4nZX9oJyvQOIv3kJF5R3KAjIW5Rik2K3qrJXKgLMES/kt/LyVw08suRlZ77MfSanHyW5jh1uydTRTKEP3cfFfADjglnN+JPNnhJg0s+rxNTOzh3FJ+t+cdjhrXpza3u74i2dFejqayvDKORHC+I1F1BSzU8NNUO1K57tfIg+LUc8T4EJZrJ331RK+WVTzVos4aoZqgPn2L2n7sA==`,
  //   ...request.headers,
  // };
  if (authStore.token) {
    // @ts-ignore
    request.headers = {
      'GO-AUTH': `${String(authStore.token)}`,
      ...request.headers,
    };
  }

  return request;
};

// 공통 Request - error
const handleRequestReject = (e: unknown) => Promise.reject(e);

export const handleResponseFullfilled = (
  response: AxiosResponse<IResponse<unknown>>
) => {
  if (response.data.code && response.data.code !== '0000') {
    /* eslint-disable no-throw-literal */
    throw {
      code: response?.data?.code,
      message: response.data.message,
      response,
    };
  }

  return response;
};

interface IErrorResponse {
  message: string;
  [key: string]: unknown; // 오류 응답이 다른 프로퍼티를 포함할 수 있습니다.
}

export const handleResponseReject = (error: AxiosError) => {
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    alert(
      '연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요.\n (지속적으로 지연이 발생하면 연구소로 문의 바랍니다.)'
    ); // 타임아웃 시 메시지 표시
    window.location.href = '/';
    return;
  }
  if (
    error.response &&
    (error.response.data as IErrorResponse).message === 'Signature has expired.'
  ) {
    alert('로그인 시간이 만료되었습니다. 다시 로그인 해주세요');
    localStorage.clear();
    window.location.href = '/';
    return;
  }

  // eslint-disable-next-line consistent-return
  return Promise.reject(error);
};

const registerInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    handleRequestFullfilled,
    handleRequestReject
  );
  instance.interceptors.response.use(
    handleResponseFullfilled,
    handleResponseReject
  );
};

// 공통 Interceptor 적용
registerInterceptors(ApiRequest);
registerInterceptors(BoRequest);
registerInterceptors(BoV2Request);
registerInterceptors(BoV3Request);
registerInterceptors(CommonRequest);
registerInterceptors(CommonV3Request);
registerInterceptors(FqsApiRequest);
registerInterceptors(FqsToolsRequest);
registerInterceptors(GcV1Request);
