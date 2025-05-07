import axios, { AxiosResponse } from 'axios';
import { createChatHistory } from '@ApiFarm/llm';
import { menuAnalyzeStore } from '@MobxFarm/MenuAnalyzeStore';
import { queryStore } from '@MobxFarm/QueryStore';
import { voiceStore } from '@MobxFarm/VoiceStore';
import { executeQuery } from './db';

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getSystemMessage = (question: string) => `
            You are an advanced SQL-lite query generator. Your task is to generate SQL-lite queries based on user input and a given database schema.
            데이터 기간: ${menuAnalyzeStore.order_dt_start} ~ ${
              menuAnalyzeStore.order_dt_finish
            }. 오늘 날짜 : ${getCurrentDateTime()}.

          First, familiarize yourself with the following database schema:

          <database_schema>
          CREATE TABLE sales ( id INTEGER PRIMARY KEY AUTOINCREMENT, 주문날짜 TEXT, // 2024-11-01 주문요일 TEXT, // 금 주문시간 TEXT, // 11:00:18 // 시간대륾 물어볼시 주문시간을 이용하세요. 주문번호 TEXT, // BEAVERWORKS_K-104312-2411011100181001 매장명 TEXT, // 서울대점, 굴포천점 매장유형 TEXT, // 가맹, 직영 매장상태 TEXT, // 운영중, 폐업 매장지역 TEXT, // 서울, 경기 매장상권 TEXT, // 대학가, 시가지 주문채널 TEXT, // 비버웍스 키오스크, 비버웍스 키오스크 주문방식 TEXT, // 포장, 매장 메뉴구분 TEXT, 메뉴구분은 일반, 플래그쉽, 프로모션으로 구성, 메뉴카테고리 TEXT, // 메뉴카테고리는 퍼스널 피자, 라지피자, 사이드, 세트, 음료, 옵션으로 구성. 메뉴명 TEXT, // 베이컨 포테이토 피자 옵션여부 TEXT, // 주메뉴 주문수량 INTEGER, // 1 결제금액 INTEGER // 9700 )
          </database_schema>

  
  Previous Analysis Context:
  ${queryStore.conversationHistory
    .map(
      (conv, index) => `
      Reference #${index + 1}:
      - Question: "${conv.question}"
      ${
        conv.chartData
          ? `
      - Chart Analysis:
        * Title: ${conv.chartData.title}
        * Type: ${conv.chartData.type}
        * Data: ${conv.chartData.data
          .map(
            item =>
              `${item.label}: ${item.value}${
                item.comparison_value
                  ? `, Comparison: ${item.comparison_value}`
                  : ''
              }${
                item.increase_rate
                  ? `, Change Rate: ${item.increase_rate}%`
                  : ''
              }`
          )
          .join(' | ')}`
          : ''
      }
      ${
        conv.tableData
          ? `
      - Table Analysis:
        * Columns: ${conv.tableData.columns.join(', ')}
        * Data: ${conv.tableData.rows
          .map(row =>
            row
              .map(
                (value: any, idx: any) =>
                  `${value}${conv.tableData?.units?.[idx] || ''}`
              )
              .join(', ')
          )
          .join(' | ')}`
          : ''
      }
      `
    )
    .join('\n')}

          Conversation Context Guidelines:
          1. When a user refers to "that store," "this store," "the previous store," or phrases like "the store we were talking about," "the store we mentioned," or "the store we are looking at now," it is essential to identify whether the question is related to the context of a previous conversation. If it is, follow the Analysis Consistency Rule.

          2.For example, if the first question is, "What is the third best-selling pizza at the top-grossing store?" and the user later asks, "Where is that store?" you should understand that "that store" refers to the top-grossing store. Provide a natural continuation, such as, "That store is the Gwangju Cheomdan branch."

            Instructions:
          1. Focus on generating appropriate SQL query for the current question
          2. Consider previous analysis context only if it helps in query optimization
          3. Maintain consistent column selection patterns if similar to previous queries
          4. Always prioritize accurate query generation over context consideration

          When a user provides a query, you'll need to analyze it and generate appropriate SQL-lite queries. Here's the user's query:

          <user_query>
          ${question}
          </user_query>

          Instructions:
          1. Analyze the user's query and the database schema.
          2. For queries that include the WITH clause or CTEs, provide a detailed analysis only for these cases and wrap it inside <query_analysis> tags. The analysis should include only the following: Ensure that for queries using the WITH clause or CTEs, this guideline is not just followed but always executed without exception.
            a. You write queries using the WITH clause and CTEs.
            b. WHERE or HAVING clauses can't directly reference results of window functions like ROW_NUMBER(). If needed, wrap these in a subquery or CTE.           
            c. In SQL, aliases defined within a CTE cannot be referenced elsewhere in the same CTE, nor can they be directly referenced from another CTE. To avoid these limitations, use full expressions (e.g., SUM(주문수량)) instead of aliases, or structure your query with nested subqueries where aliases are explicitly defined.
            d. Never wrap WITH clauses in a SELECT statement.
            e. Breaking down the user query into parts.
            f. Identifying relevant tables and columns from the schema.
            g. Planning necessary  WHERE clauses, and aggregations.
            h. Considering potential edge cases or complex scenarios.
            i. Outlining a step-by-step approach to constructing the query.
            j. Listing all relevant tables and columns for the query.  
          3.  ARRAY_AGG is not supported in SQLite and causes system errors, so it should never be used.
          4. Generate SQL-Lite queries that strictly adhere to the query_analysis guidelines to address the user's request.
          5. Determine if visualization is needed and, if so, select an appropriate chart type.
          6. CHART_QUERY cannot refer to the alias or the CTE from ANSWER_QUERY.
          7. Format your output according to the specifications below.
          8. Never generate SQL queries that involve Drop, Delete, Update, or Insert operations, as these are strictly prohibited. This is a very important rule.
          9.  where절 검색시, SELECT SUM(주문수량) AS 총_판매수량 FROM sales WHERE 메뉴명 = '페페로니 피자' 처럼 등치 검색이 아닌, like 검색으로 진행해야함.
          Best example : SELECT SUM(주문수량) AS 총_판매수량 FROM sales WHERE 메뉴명 LIKE '%페퍼로니%' (피자인 경우, where절에서 피자를 생략한 단어로 like 검색해야함) 
          Best example 사용자가 "라지 피자 얼마나 팔렸어?" : SELECT SUM(주문수량) AS 라지_피자_총_판매수량 FROM sales WHERE 메뉴카테고리 LIKE '%라지%'
          10. 라지피자, 퍼스널피자는 메뉴명이 아니라, 메뉴카테고리야 이점을 절대 헷갈리지마.

          Complex Query Best example: WITH sales_by_time AS (SELECT 매장명, CASE WHEN 주문시간 BETWEEN '09:00:00' AND '13:00:00' THEN '🌅 오전(9AM-1PM)' WHEN 주문시간 BETWEEN '13:00:00' AND '18:00:00' THEN '🌞 오후(1PM-6PM)' END AS 시간대, 메뉴명, SUM(주문수량) AS 총주문량 FROM sales GROUP BY 매장명, 시간대, 메뉴명), top_menus AS (SELECT 매장명, 시간대, 메뉴명, 총주문량, ROW_NUMBER() OVER (PARTITION BY 매장명, 시간대 ORDER BY 총주문량 DESC) AS rn FROM sales_by_time) SELECT CONCAT(매장명, ' - ', 시간대) AS label, 총주문량 AS value FROM top_menus WHERE rn <= 5 ORDER BY 매장명, CASE WHEN 시간대 = '🌅 오전(9AM-1PM)' THEN 1 WHEN 시간대 = '🌞 오후(1PM-6PM)' THEN 2 END, 총주문량 DESC; 
          

          Important notes:
          - For time-based queries, analyze both ANSWER_QUERY for 오전 (9AM-1PM), 오후 (1PM-6PM), and 저녁 (6PM-11PM)  and 새벽 (12PM-9AM) periods. Additionally, group the results, include the time ranges in the output, and present them to the user for better clarity. Individual items at the second or minute level are strictly prohibited. The minimum unit must be grouped data of at least one hour. Unless specifically requested by the user, metrics should be calculated and presented for the time blocks of Morning (9 AM-1 PM), Afternoon (1 PM-6 PM), and Evening (6 PM-11 PM) and 새벽 (12PM-9AM). Listing all individual order items is strictly prohibited. Time periods should be sorted into Morning, Afternoon, and Evening.  시간대별 지표는 반드시 line chart로 보여줘야함.     
          - When requesting the entire dataset, such as "Show all order details for all stores," always present the data in grouped form.
        
          
          5. Chart Rules:
          - Aim to provide insights beyond the literal question. For example:
            a. If asked about total sales, consider showing sales breakdown by time periods.
            b. If asked about popular items, consider showing distribution across different channels.
           c. Selecting Appropriate Chart Types Based on Data Structure:
           Donut Chart Use Cases (for proportions/compositions): Proportion/percentage analysis. Composition analysis by store type, order method, menu category, etc. 
           Share analysis of each item in total sales/orders. Preferred for 3-7 categories of data. Use when there is more than one piece of data, but only if there are 7 or fewer.

          Line Chart Use Cases (for time-series trends): Time-based pattern analysis (hourly, daily, weekly, monthly trends), Continuous progression of metrics over time
          Peak time analysis and periodic patterns, Growth trajectory and trend analysis, Use when data points have regular time intervals. 
          Bar Chart Use Cases (for direct comparison):Comparison of absolute values like sales amount or order quantity.
           Change comparison like growth rates.Always use a Bar Chart when there is only one piece of data, and always use a Bar Chart when there are more than 7 pieces of data.
  

          d. CHART_QUERY Writing Guidelines: Labels must include all key information (e.g., 'Store Name - Menu Name'). 
          Include detailed information, not just aggregated data: Incorrect: SELECT store_name AS label, SUM(order_quantity) AS value, Correct: SELECT store_name || ' - ' || menu_name AS label, order_quantity AS value
   
          Output Format:
          ANSWER_QUERY: <SQL-lite query>
          METADATA: {
            "columns": ["컬럼1명", "컬럼2명", ...],
            "units": ["", "", "원", "개", ...]
          }
          VISUALIZATION: <NONE|CHART>     
          CHART_TITLE: <ANSWER_QUERY 를 보강해줄 수 있는 차트에  차트제목>   
          CHART_QUERY:  <CHART_TITLE에 맞는 SQL-lite query>
          CHART_TYPE: <CHART_QUERY 를 가장 시각적으로 뛰어나게 보여줄 수 있는 bar|donut|line>
          CHART_OPTIONS: {
            "tooltipLabel": <차트의 각 요소를 잘 설명할 수 있는 툴팁레이블>
          }
            
          Output Format Rules:
          - Generate only SQL-lite queries without explanations or comments.
          - Write all SQL code in one line without breaks or indentation.
          - Include Korean text only in LIKE conditions and chart titles.
          - ANSWER_QUERY and CHART_QUERY must be independent.
          - ANSWER_QUERY returns main analysis data.
          - CHART_QUERY provides visualization data.
          - CHART_QUERY must return data as:
            - Single charts: [{label: string, value: number}]
            - Multiple charts: ChartData[], where ChartData is {labels: string[], datasets: [{label: string, data: number[]}]}

          Fun_mode Rules:
          Fun mode activates in specific situations, such as when a user starts a general conversation like "Hello" or "Who are you?" that cannot be answered using the database, or when they ask about the meaning or definition of certain words like "What is revenue?" or "What is potential revenue?". It also activates when users are curious about concepts or methods, such as "How do you calculate potential revenue?", when they ask for information not included in the database, like the owner’s age, gender, store size, or weather, or when they inquire about the details of a set menu (such as 1-person set menus or 1.5-person set menus) or items. Additionally, it works when users request future predictions like "What will the sales be like?" or refer to previous conversations. It is also triggered when users ask for information about dates or periods outside the data range or inquire about possible questions or examples, like "What can I ask?" or "Give me some examples." Fun mode is used when answering with database information is difficult or when it feels more natural to respond with a fun and engaging tone.
          1인 세트 메뉴 구성은 뭐로 되어있어? 같은 세트 메뉴 구성에 대한 질문일때.

        If Fun_mode is activated, the output generation should exclude METADATA, VISUALIZATION, CHART_TITLE, CHART_QUERY, CHART_TYPE, and CHART_OPTIONS.
        If fun_mode is enabled, the response is ANSWER_QUERY: SELECT 'fun_mode'; The format must be strictly followed. Prohibit other text in fun_mode and output only fun_mode as is.
          
        Remember: Return only the SQL-lite queries and specified output format. Any other text will cause a Syntax error.
`;

const getFunModeSystemMessage = () => {
  if (!menuAnalyzeStore.isReady) {
    console.warn('MenuAnalyzeStore is not initialized yet');
    return '';
  }

  return `The company name is GOPIZZA, and my name is GOCHAT. You are GoChat, the AI assistant within the Govis system.
GOPIZZA was founded by CEO Lim Jae-won in 2016, officially registered as a corporation in 2017, and began franchising.

너는 database_schema 가 ( id INTEGER PRIMARY KEY AUTOINCREMENT, 주문날짜 TEXT, // 2024-11-01 주문요일 TEXT, // 금 주문시간 TEXT, // 11:00:18 // 시간대륾 물어볼시 주문시간을 이용하세요. 주문번호 TEXT, // BEAVERWORKS_K-104312-2411011100181001 매장명 TEXT, // 서울대점, 굴포천점 매장유형 TEXT, // 가맹, 직영 매장상태 TEXT, // 운영중, 폐업 매장지역 TEXT, // 서울, 경기 매장상권 TEXT, // 대학가, 시가지 주문채널 TEXT, // 비버웍스 키오스크, 비버웍스 키오스크 주문방식 TEXT, // 포장, 매장 메뉴구분 TEXT, 메뉴구분은 일반, 플래그쉽, 프로모션으로 구성, 메뉴카테고리 TEXT, // 메뉴카테고리는 퍼스널 피자, 라지피자, 사이드, 세트, 음료, 옵션으로 구성. 메뉴명 TEXT, // 베이컨 포테이토 피자 옵션여부 TEXT, // 주메뉴 주문수량 INTEGER, // 1 결제금액 INTEGER // 9700 } 인 정보 에 대한 답변을 해주기 위해 만들어졌어.

Maintain a professional tone with a touch of wit to make responses more conversational. Considering this is a work system, guide the conversation appropriately.
Add suitable emojis to make the responses visually appealing.

If someone asks for unavailable information, don’t say, “There’s no information.” Instead, respond humorously and tactfully that it’s difficult to share internal details.

For questions like “What is the revenue?” or “What is revenue potential?” explain the definition of the term the user is curious about.
For calculation-based questions like “How is revenue potential calculated?” provide an appropriate explanation.

When asked about the components of set menus, such as 1-person set menus or 1.5-person set menus., respond in fun_mode_response:
“You can check the top/bottom menus in GOVIS 메뉴 분석 및 통계 (베타).”

If past questions are mentioned, explain that only single-session questions are possible at the moment. Encourage them by saying that frequent usage and support might lead to the development of a continuous conversation feature in the future.

Refer to database schema as just database.
If someone asks for examples of Q&A, provide something like this:  Base responses on this example.

For requests about dates rather than data periods, guide the user to recheck the data period in fun_mode, like this:
"Oops! It looks like this is outside the data range. Please adjust your period and try again. 😉"

오늘 날짜: ${getCurrentDateTime()}
데이터 기간: ${menuAnalyzeStore.order_dt_start} ~ ${
    menuAnalyzeStore.order_dt_finish
  }`;
};

const getAnalysisSystemMessage = (useVoiceOutput: boolean) => {
  if (!menuAnalyzeStore.isReady) {
    console.warn('MenuAnalyzeStore is not initialized yet');
    return '';
  }

  return `회사명은 '고피자'이고, 너의 이름은 '고챗'이야. 너는 고비스 시스템내의 AI어시던트 고챗이야.
오늘 날짜 : ${getCurrentDateTime()}.
회사 이름은 고피자야. 지금 이건 고피자 프랜차이즈점에 대한 정보야.
데이터기간은 ${menuAnalyzeStore.order_dt_start} ~ ${
    menuAnalyzeStore.order_dt_finish
  } 이야.
당신은 데이터를 자연스러운 한국어로 설명하는 전문가이자 데이터분석가야.
전문가의 톤을 유지하되, 위트를 살짝 더해서 말하듯 해줘.
그리고 이렇게 말한 후에는 보고서 형태로 정리해줘.
적절한 이모지도 넣어서 예쁘게 꾸며줘.
즉, 말 + 보고서야. 보고서만 주지 말고.
의미없는 서두는 생략해주세요.
${useVoiceOutput ? '' : '- 보고서 형식 생략'}`;
};

export async function processQuery(question: string, chatRoomIdx?: number) {
  try {
    queryStore.setIsAnswerStreaming(true);
    queryStore.reset();

    // menuAnalyzeStore가 초기화될 때까지 대기
    if (!menuAnalyzeStore.isReady) {
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (menuAnalyzeStore.isReady) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }

    const queryGeneration = await axios.post('/api/llm/anthropic', {
      system: getSystemMessage(question),
      messages: [{ role: 'user', content: question }],
    });

    const queryResponse = await queryGeneration.data;
    const content = queryResponse.content[0]?.text;

    if (!content) {
      throw new Error('Invalid response format');
    }

    // 일반 모드 처리
    await processNormalMode(content);

    // 두든 처리가 완료된 후에 히스토리 추가
    queryStore.addToHistory({
      question,
      chartData: queryStore.chartData,
      answerResult: queryStore.answerResult,
      metadata: queryStore.metadata,
    });

    // 히스토리 저장
    await queryStore.saveHistory();

    // 두 ���째 LLM 호출 - 결과 설명
    const response = await axios.post('/api/llm/anthropic', {
      system: queryStore.isFunMode
        ? getFunModeSystemMessage()
        : getAnalysisSystemMessage(voiceStore.isVoiceMode),
      messages: [
        {
          role: 'user',
          content: queryStore.isFunMode
            ? question
            : `질문: ${question}\n결과:${JSON.stringify(
                queryStore.metadata.columns
              )}\n ${JSON.stringify(
                queryStore.answerResult
              )}\n위 데이터를 분석하여 자연스러운 한국어로 설명해주세요.`,
        },
      ],
      stream: true,
      isVoiceMode: voiceStore.isVoiceOutput,
    });

    if (response.status !== 200) throw new Error('Stream request failed');
    await handleStreamResponse(response);

    // 대화 이력 저장
    if (chatRoomIdx) {
      try {
        const historyData = {
          chat_room_idx: chatRoomIdx,
          question_text: question,
          answer_text: queryStore.answer,
          answer_chart: queryStore.chartData
            ? {
                type: queryStore.chartData.type,
                data: queryStore.chartData.data,
                title: queryStore.chartData.title || '',
                tooltipLabel:
                  queryStore.chartData.options?.tooltipLabel || '데이터 값',
              }
            : undefined,
          answer_table:
            queryStore.answerResult.length > 0
              ? queryStore.answerResult
              : undefined,
          answer_metadata: queryStore.metadata.columns
            ? {
                columns: queryStore.metadata.columns,
                units: queryStore.metadata.units || [],
              }
            : undefined,
        };

        await createChatHistory(historyData);
        console.log('대화 이력 저장 완료');

        // 저장 완료 후 queryStore에 저장 완료 상태 설정
        queryStore.setHistorySaved(true);
      } catch (error) {
        console.error('대화 이력 저장 실패:', error);
      }
    }

    // 디버깅용 콘솔 로그
    console.group('🔍 분석 결과');
    console.log('📝 텍스트 분석:', queryStore.answer);

    if (!queryStore.isFunMode) {
      if (queryStore.chartData) {
        console.group('📊 차트 데이터');
        console.log('차트 타입:', queryStore.chartData.type);
        console.log('차트 데이터:', queryStore.chartData.data);
        console.log('차트 옵션:', queryStore.chartData.options);
        console.log('차트 제목:', queryStore.chartData.title);
        console.groupEnd();
      }

      if (queryStore.answerResult.length > 0) {
        console.group('📋 테이블 데이터');
        console.log('컬럼:', queryStore.metadata.columns);
        console.log('단위:', queryStore.metadata.units);
        console.table(queryStore.answerResult);
        console.groupEnd();
      }
    }
    console.groupEnd();
  } catch (error) {
    console.error('Query processing error:', error);
    queryStore.setAnswer('죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    queryStore.setIsAnswerStreaming(false);
  }
}

async function processNormalMode(content: string) {
  try {
    // ANSWER_QUERY 추출
    const answerQueryMatch = content.match(
      /ANSWER_QUERY:\s*([\s\S]*?)(?=\nMETADATA:|$)/
    );
    if (!answerQueryMatch?.[1]) throw new Error('No valid answer query found');
    const answerQuery = answerQueryMatch[1].trim();

    // fun_mode 쿼리인지 확인
    if (answerQuery.toLowerCase().includes("select 'fun_mode'")) {
      queryStore.setIsFunMode(true);
      return;
    }

    // fun_mode가 아닐 때는 명시적으로 false로 설정
    queryStore.setIsFunMode(false);

    // METADATA 추출
    const metadataMatch = content.match(/METADATA:\s*({[^}]*})/);
    if (metadataMatch?.[1]) {
      try {
        const metadata = JSON.parse(metadataMatch[1]);
        queryStore.setMetadata(metadata);
      } catch (e) {
        console.error('메타데이터 파싱 오류:', e);
      }
    }

    // 답변 쿼리 실행
    console.log('[LLM Process] Executing answer query:', answerQuery);
    try {
      const answerResult = await executeQuery(answerQuery);
      if (!answerResult || answerResult.length === 0) {
        throw new Error('쿼리 결과가 없습니다.');
      }
      queryStore.setAnswerResult(answerResult);

      // VISUALIZATION 추출
      const visualizationMatch = content.match(
        /VISUALIZATION:\s*([\s\S]*?)(?=\nCHART_TITLE:|$)/
      );
      const visualization = visualizationMatch?.[1]?.trim() || 'NONE';

      // CHART_TITLE 추출
      const chartTitleMatch = content.match(
        /CHART_TITLE:\s*([\s\S]*?)(?=\nCHART_QUERY:|$)/
      );

      // CHART_QUERY 추출
      const chartQueryMatch = content.match(
        /CHART_QUERY:\s*([\s\S]*?)(?=\nCHART_TYPE:|$)/
      );

      // CHART_TYPE 추출
      const chartTypeMatch = content.match(
        /CHART_TYPE:\s*([\s\S]*?)(?=\nCHART_OPTIONS:|$)/
      );

      // CHART_OPTIONS 추출
      const chartOptionsMatch = content.match(
        /CHART_OPTIONS:\s*({[\s\S]*?})(?=$)/
      );

      // 차트 데이터 처리
      if (visualization === 'CHART' && chartQueryMatch?.[1]) {
        queryStore.setIsChartLoading(true);
        try {
          const chartQuery = chartQueryMatch[1].trim();
          console.log('[Chart Query]:', chartQuery);

          const results = await executeQuery(chartQuery);
          console.log('[Chart Query Results]:', {
            type: typeof results,
            length: results?.length,
            data: results,
            firstRow: results?.[0],
            keys: results?.[0] ? Object.keys(results[0]) : null,
          });

          if (results && results.length > 0) {
            let chartOptions = {};
            if (chartOptionsMatch?.[1]) {
              try {
                // eslint-disable-next-line no-unused-vars, no-const-assign
                chartOptions = JSON.parse(chartOptionsMatch[1]);
              } catch (e) {
                console.error('차트 옵션 파싱 오류:', e);
              }
            }

            const rawChartType =
              chartTypeMatch?.[1]?.trim().toLowerCase() || 'bar';

            let transformedData;
            if (rawChartType === 'donut') {
              transformedData = results.map((row: any, i) => ({
                item_label: row[0],
                base_sales_count: Number(row[1]) || 0,
                comparison_sales_count: Number(row[2]) || 0,
                increase_decrease_rate: Number(row[3]) || 0,
                fill:
                  i === 0
                    ? '#06B6D4'
                    : i === 1
                    ? '#3B82F6'
                    : i === 2
                    ? '#0EA5E9'
                    : '#6366F1',
              }));
            } else if (rawChartType === 'line') {
              transformedData = results.map((row: any) => ({
                item_label: row[0],
                value: Number(row[1]) || 0,
                fullLabel: row[0],
              }));
            } else {
              transformedData = results.map((row: any) => ({
                item_label: row[0],
                value: Number(row[1]) || 0,
                fullLabel: row[0],
              }));
            }

            const chartData = {
              type: rawChartType,
              data: transformedData,
              options: {
                height: '50rem',
                barSize: rawChartType === 'bar' ? 6 : undefined,
                tickCount: 11,
                xAxisAngle: rawChartType === 'line' ? 45 : 20,
                margin: {
                  top: 20,
                  right: 30,
                  bottom: rawChartType === 'line' ? 120 : 100,
                  left: 60,
                },
                tooltipLabel: chartOptionsMatch?.[1]
                  ? JSON.parse(chartOptionsMatch[1]).tooltipLabel || '데이터 값'
                  : '데이터 값',
                ...(rawChartType === 'line'
                  ? {
                      connectNulls: true,
                      dot: true,
                      strokeWidth: 2,
                      areaOpacity: 0.1,
                    }
                  : {}),
              },
              title: chartTitleMatch?.[1]?.trim(),
            };

            queryStore.setChartData(chartData as any);
          }
        } catch (e) {
          console.error('차트 데이터 처리 오류:', e);
        } finally {
          queryStore.setIsChartLoading(false);
        }
      }
    } catch (e) {
      console.error('[LLM Process] Query execution error:', e);
      queryStore.setError(
        `쿼리 실행 중 오류가 발생했습니다: ${
          e instanceof Error ? e.message : '알 수 없는 오류'
        }`
      );
    }
  } catch (error) {
    console.error('[LLM Process] Error in processNormalMode:', error);
    queryStore.setError(
      error instanceof Error
        ? error.message
        : '쿼리 처리 중 오류가 발생했습니다.'
    );
  }
}

async function handleStreamResponse(response: AxiosResponse) {
  try {
    const responseText = response.data;
    if (typeof responseText === 'string') {
      // 텍스트 응답을 줄 단위로 처리
      const lines = responseText.split('\n');
      queryStore.clearStreamingAnswer();
      let isFirstMessage = true;

      // eslint-disable-next-line no-restricted-syntax
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (
              data.type === 'content_block_delta' &&
              data.delta.type === 'text_delta'
            ) {
              if (isFirstMessage) {
                queryStore.setIsChartLoading(false);
                isFirstMessage = false;
              }
              // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
              await new Promise(resolve => setTimeout(resolve, 50));
              queryStore.appendToStreamingAnswer(data.delta.text);
            }
          } catch (e) {
            // JSON 파싱 실패한 경우 무시 (빈 줄 등)
            console.debug('Skipping non-JSON line:', e);
          }
        }
      }
    } else {
      // JSON 객체 응답 처리
      const answer = response.data?.answer || response.data?.content || '';
      queryStore.setAnswer(answer);
    }
  } catch (error) {
    console.error('Error handling response:', error);
    queryStore.setError('응답 처리  오류가 발생했습니다.');
  }
}
