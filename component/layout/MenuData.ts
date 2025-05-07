type MenuType = {
  depth1: string;
  group: string;
  depth2?: {
    name: string;
    path: string;
    perm_code: string;
    perm_info_idx: number;
  }[];
  path?: string;
  perm_code?: string;
  perm_info_idx?: number;
};

export const TotalMenu: MenuType[] = [
  // {
  //   depth1: '홈',
  //   group: 'Home',
  //   path: '/dashboard',
  //   perm_info_idx: 0,
  // },
  // {
  //   depth1: '매출 분석',
  //   group: 'HeadOffice',
  //   depth2: [
  //     {
  //       name: '매출 종합현황',
  //       path: '/sales/month-static',
  //       perm_code: 'sales_stores_report',
  //       perm_info_idx: 11,
  //     },
  //     // {
  //     //   name: '매장별 통계',
  //     //   path: '/sales/store',
  //     //   perm_code: 'sales_stores',
  //     //   perm_info_idx: 12,
  //     // },
  //     {
  //       name: '시간대별 통계',
  //       path: '/sales/time',
  //       perm_code: 'sales_time',
  //       perm_info_idx: 13,
  //     },
  //     {
  //       name: '일별 매출',
  //       path: '/sales/daily',
  //       perm_code: 'sales_day',
  //       perm_info_idx: 14,
  //     },
  //     {
  //       name: '월별 매출',
  //       path: '/sales/month',
  //       perm_code: 'sales_month',
  //       perm_info_idx: 15,
  //     },
  //   ],
  // },
  // {
  //   depth1: '제품 실적',
  //   group: 'HeadOffice',
  //   depth2: [
  //     {
  //       name: '주 제품 판매 현황',
  //       path: '/product/main',
  //       perm_code: 'order_menu',
  //       perm_info_idx: 16,
  //     },
  //     {
  //       name: '제품 그룹 현황',
  //       path: '/product/group',
  //       perm_code: 'order_product',
  //       perm_info_idx: 17,
  //     },
  //     {
  //       name: '주문 제품 구성 현황',
  //       path: '/product/combo',
  //       perm_code: 'order_menu_detail',
  //       perm_info_idx: 18,
  //     },
  //   ],
  // },
  {
    depth1: '매장별 매출',
    group: 'HeadOffice',
    path: '/sales-analyze',
    perm_code: 'sales_stores',
    perm_info_idx: 12,
  },
  {
    depth1: '제품 분석 및 통계',
    group: 'HeadOffice',
    path: '/product-analyze',
    perm_code: 'product_sales_analytics',
    perm_info_idx: 100,
  },
  {
    depth1: '메뉴 분석 및 통계',
    group: 'HeadOffice',
    path: '/menu-analyze-beta',
    perm_code: 'product_sales_analytics',
    perm_info_idx: 100,
  },
  {
    depth1: '제품 관리',
    group: 'HeadOffice',
    path: '/product',
    perm_code: 'product',
    perm_info_idx: 19,
  },
  {
    depth1: '원재료 관리',
    group: 'HeadOffice',
    path: '/material',
    perm_code: 'material',
    perm_info_idx: 22,
  },
  {
    depth1: '레시피 관리',
    group: 'HeadOffice',
    path: '/product-recipes',
    perm_code: 'recipe',
    perm_info_idx: 21,
  },
  {
    depth1: '메뉴 관리',
    group: 'HeadOffice',
    path: '/menu',
    perm_code: 'menu',
    perm_info_idx: 20,
  },
  {
    depth1: `AI Smart\nTopping Table`,
    group: 'HeadOffice',
    depth2: [
      {
        name: '현황',
        path: '/aistt-state',
        perm_code: 'aistt_state',
        perm_info_idx: 70,
      },
      // {
      //   name: '레포트 관리',
      //   path: '/aistt-report',
      //   perm_code: '',
      //   perm_info_idx: 35,
      // },
      {
        name: '매장 모니터링',
        path: '/aistt-monitoring',
        perm_code: 'aistt_monitering',
        perm_info_idx: 73,
      },
      {
        name: '제품 분석',
        path: '/aistt-analysis',
        perm_code: '',
        perm_info_idx: 71,
      },
      {
        name: 'AISTT 관리',
        path: '/aistt-device',
        perm_code: 'aistt_device',
        perm_info_idx: 72,
      },
    ],
  },
  {
    depth1: '매장 관리',
    group: 'HeadOffice',
    depth2: [
      {
        name: '매장 관리',
        path: '/bo/store',
        perm_code: 'store',
        perm_info_idx: 24,
      },
      {
        name: '매출 채널 관리',
        path: '/bo/sales-channel',
        perm_code: 'sales_channel_management',
        perm_info_idx: 999,
      },
      {
        name: '매장 매출 수기입력',
        path: '/store-sales-keyin',
        perm_code: 'sales_keyin',
        perm_info_idx: 25,
      },
    ],
  },
  {
    depth1: '사용자 관리',
    group: 'HeadOffice',
    depth2: [
      {
        name: '사용자 관리',
        path: '/bo/user',
        perm_code: 'manage_user',
        perm_info_idx: 23,
      },
      {
        name: '사용자 등록',
        path: '/bo/user-add',
        perm_code: 'manage_user_post',
        perm_info_idx: 52,
      },
      {
        name: '권한 그룹 관리',
        path: '/bo/user/permission',
        perm_code: 'perm_group',
        perm_info_idx: 44,
      },
    ],
  },
  {
    depth1: '자료 다운 받기',
    group: 'HeadOffice',
    path: '/excel',
    perm_code: 'report',
    perm_info_idx: 0,
  },
  {
    depth1: '알람 관리',
    group: 'HeadOffice',
    depth2: [
      {
        name: '본사알람 관리',
        path: '/alarm/headoffice',
        perm_code: 'alarm_head',
        perm_info_idx: 47,
      },
      {
        name: '매장알람 관리',
        path: '/alarm/store',
        perm_code: 'alarm_store',
        perm_info_idx: 48,
      },
    ],
  },
  {
    depth1: '게시판 관리',
    group: 'Franchise',
    depth2: [
      {
        name: '공지사항 관리',
        path: '/fc/notice',
        perm_code: 'board_notice',
        perm_info_idx: 26,
      },
      {
        name: '레시피 정복',
        path: '/fc/recipes',
        perm_code: 'board_recipe',
        perm_info_idx: 27,
      },
      {
        name: '뉴스레터',
        path: '/fc/news',
        perm_code: 'board_newsletter',
        perm_info_idx: 28,
      },
      {
        name: '우리가 불편해야\n 고객이 만족한다',
        path: '/fc/best-practices',
        perm_code: 'board_story',
        perm_info_idx: 30,
      },
      {
        name: '상품 피드백',
        path: '/fc/feedback',
        perm_code: 'board_product_feedback',
        perm_info_idx: 31,
      },
    ],
  },
  {
    depth1: '이벤트 관리',
    group: 'Franchise',
    depth2: [
      {
        name: '카카오톡 프로모션',
        path: '/fc/coupons',
        perm_code: 'coupon_promotion',
        perm_info_idx: 29,
      },
      {
        name: '캘린더',
        path: '/fc/calendar',
        perm_code: 'board_calendar',
        perm_info_idx: 35,
      },
    ],
  },

  {
    depth1: '문의 관리',
    group: 'Franchise',
    depth2: [
      {
        name: '건의&문의',
        path: '/fc/forums',
        perm_code: 'board_qna',
        perm_info_idx: 32,
      },
      {
        name: '인테리어 AS',
        path: '/fc/interiors',
        perm_code: 'board_interior',
        perm_info_idx: 33,
      },
      {
        name: '반품 문의',
        path: '/fc/returns',
        perm_code: 'board_return',
        perm_info_idx: 34,
      },
    ],
  },
  {
    depth1: 'G-FQS',
    group: 'Franchise',
    depth2: [
      {
        name: '대시보드',
        path: '/gobot/dashboard',
        perm_code: 'g_fqs_dashboard',
        perm_info_idx: 39,
      },
      {
        name: '제품 분석',
        path: '/gobot/analysis',
        perm_code: 'g_fqs_analysis',
        perm_info_idx: 40,
      },
      {
        name: '데이터 검수',
        path: '/gobot/inspection',
        perm_code: 'g_fqs_Inspection',
        perm_info_idx: 41,
      },
    ],
  },
  {
    depth1: 'IoT 관리',
    group: 'Franchise',
    depth2: [
      {
        name: 'GoAir 관리 매장',
        path: '/iot/goair',
        perm_code: 'iot_goair_store',
        perm_info_idx: 42,
      },
      {
        name: 'GoAir 기기 관리',
        path: '/iot/goair-admin',
        perm_code: 'iot_goair_manage',
        perm_info_idx: 43,
      },
      {
        name: 'Goven 관리',
        path: '/iot/goven',
        perm_code: 'iot_goven',
        perm_info_idx: 0,
      },
    ],
  },
  {
    depth1: '매장 평가',
    group: 'Franchise',
    depth2: [
      {
        name: '대시보드',
        path: '/qsc/dashboard',
        perm_code: 'qsc_dashboard',
        perm_info_idx: 49,
      },
      {
        name: '매장QC 관리',
        path: '/qsc/store',
        perm_code: 'qsc_store',
        perm_info_idx: 50,
      },
      {
        name: '체크리스트 관리',
        path: '/qsc/checklist',
        perm_code: 'qsc_check',
        perm_info_idx: 51,
      },
    ],
  },
  {
    depth1: '배너 및 프로모션 관리',
    group: 'Homepage',
    depth2: [
      {
        name: '메인 배너 관리',
        path: '/brand-admin/main-banner',
        perm_code: 'homepage_brand_main_banner',
        perm_info_idx: 54,
      },
      {
        name: '창업 배너 관리',
        path: '/brand-admin/fc-banner',
        perm_code: 'homepage_startup_main_banner',
        perm_info_idx: 56,
      },
      {
        name: '프로모션 관리',
        path: '/brand-admin/promotion',
        perm_code: 'homepage_brand_promotion',
        perm_info_idx: 58,
      },
    ],
  },
  {
    depth1: '영상 관리',
    group: 'Homepage',
    depth2: [
      {
        name: '유튜브 영상 관리',
        path: '/brand-admin/youtube',
        perm_code: 'homepage_brand_main_youtube',
        perm_info_idx: 55,
      },
      {
        name: '광고영상 관리',
        path: '/brand-admin/ad',
        perm_code: 'homepage_brand_ad_video',
        perm_info_idx: 59,
      },
    ],
  },
  {
    depth1: '언론보도 관리',
    group: 'Homepage',
    path: '/brand-admin/press',
    perm_code: 'homepage_startup_press',
    perm_info_idx: 57,
  },

  {
    depth1: '창업 문의 관리',
    group: 'Homepage',
    path: '/brand-admin/store-inquiry',
    perm_code: 'homepage_startup_question_manager',
    perm_info_idx: 60,
  },
];

export const Goivs2Menu = [
  '/',
  '/product',
  '/material',
  '/menu',
  '/product-recipes',
  '/sales-analyze',
  '/product-analyze',
  '/menu-analyze',
  '/storybook',
  '/aistt-analysis',
  '/aistt-device',
  '/aistt-state',
  '/aistt-report',
  '/aistt-monitoring',
  '/aistt-tmp',
  '/menu/link',
  '/menu/link-history',
  '/storybook',
  '/store-sales-keyin',
  '/scroll_demo',
];
