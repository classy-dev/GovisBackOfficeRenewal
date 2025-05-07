// 대화방 생성 요청 인터페이스
export interface IChatRoomCreateReq {
  analysis_data_type: string;
  analysis_data_filter?: Record<string, any>;
}

// 대화방 생성 응답 인터페이스
export interface IChatRoomCreateRes {
  chat_room_idx: number;
  analysis_data_count: number;
  analysis_data_list: {
    주문날짜: string;
    주문요일: string;
    주문시간: string;
    주문번호: string;
    매장명: string;
    매장유형: string;
    매장상태: string;
    매장지역: string;
    매장상권: string;
    주문채널: string;
    주문방식: string;
    메뉴구분: string;
    메뉴카테고리: string;
    메뉴명: string;
    옵션여부: string;
    주문수량: number;
    결제금액: number;
  }[];
}

// 대화 이력 목록 요청 인터페이스
export interface IChatHistoryListReq {
  chat_room_idx: number;
}

// 대화 이력 목록 응답 인터페이스
export interface IChatHistoryListRes {
  request_info: {
    chat_room_idx: string;
  };
  result_count: number;
  result_list: {
    chat_history_idx: number;
    question_text: string;
    created_at: string;
  }[];
}

// 대화 이력 등록 요청 인터페이스
export interface IChatHistoryCreateReq {
  chat_room_idx: number;
  question_text: string;
  answer_text: string;
  answer_chart?: Record<string, any> | any[];
  answer_table?: Record<string, any> | any[];
}

// 대화 이력 등록 응답 인터페이스
export interface IChatHistoryCreateRes {
  chat_history_idx: number;
}

// 대화 이력 조회 응답 인터페이스
export interface IChatHistoryDetailRes {
  chat_history_idx: number;
  question_text: string;
  answer_text: string;
  answer_chart: {
    type: string;
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    };
    title: string;
    tooltipLabel?: string;
  };
  answer_table: [string, number][];
  answer_metadata: {
    columns: string[];
    units: string[];
  };
}
