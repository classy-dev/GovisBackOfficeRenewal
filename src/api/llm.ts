import {
  IChatRoomCreateReq,
  IChatRoomCreateRes,
  IChatHistoryListReq,
  IChatHistoryListRes,
  IChatHistoryCreateReq,
  IChatHistoryCreateRes,
  IChatHistoryDetailRes,
} from '@InterfaceFarm/llm';
import { GcV1Request } from '.';

// 대화방 생성
export const createChatRoom = async (data: IChatRoomCreateReq) => {
  const response = await GcV1Request.post<IResponse<IChatRoomCreateRes>>(
    '/chat_room',
    data
  );

  return response.data.data;
};

// 대화 이력 목록 조회
export const fetchChatHistoryList = async (params: IChatHistoryListReq) => {
  const response = await GcV1Request.get<IResponse<IChatHistoryListRes>>(
    '/chat_history',
    {
      params,
    }
  );

  return response.data.data;
};

// 대화 이력 등록
export const createChatHistory = async (data: IChatHistoryCreateReq) => {
  const response = await GcV1Request.post<IResponse<IChatHistoryCreateRes>>(
    '/chat_history',
    data
  );

  return response.data.data;
};

// 대화 이력 상세 조회
export const fetchChatHistoryDetail = async (chatHistoryIdx: number) => {
  const response = await GcV1Request.get<IResponse<IChatHistoryDetailRes>>(
    `/chat_history/${chatHistoryIdx}`
  );

  return response.data.data;
};
