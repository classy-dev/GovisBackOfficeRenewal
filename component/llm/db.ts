// lib/db.ts
import initSqlJs from 'sql.js';

export interface ApiResponse {
  code: string;
  message: string;
  data: {
    result_list: SalesData[];
  };
}

export interface SalesData {
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
}

// 대화 히스토리 저장을 위한 인터페이스 추가
export interface ConversationHistory {
  question: string;
  chartData: {
    type: string;
    title: string;
    data: any[];
  } | null;
  tableData: {
    columns: string[];
    units: string[];
    rows: any[];
  } | null;
  timestamp: number;
}

let SQL: any;
let db: any;

export const initDB = async () => {
  if (!SQL) {
    try {
      SQL = await initSqlJs({
        locateFile: file => `/sql.js/${file}`,
        // 브라우저 환경에서만 실행되도록 체크
        wasmBinary: typeof window !== 'undefined' ? undefined : undefined,
      });
      // eslint-disable-next-line no-console
      console.log('SQL.js 초기화 성공');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SQL.js 초기화 오류:', error);
      throw error;
    }
  }

  if (!db) {
    const savedDb = await loadDatabase();

    if (savedDb) {
      db = new SQL.Database(savedDb);
      console.log('Database loaded from IndexedDB');
    } else {
      db = new SQL.Database();
      console.log('New database created in memory');

      db.run(`
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          주문날짜 TEXT,
          주문요일 TEXT,
          주문시간 TEXT,
          주문번호 TEXT,
          매장명 TEXT,
          매장유형 TEXT,
          매장상태 TEXT,
          매장지역 TEXT,
          매장상권 TEXT,
          주문채널 TEXT,
          주문방식 TEXT,
          메뉴구분 TEXT,
          메뉴카테고리 TEXT,
          메뉴명 TEXT,
          옵션여부 TEXT,
          주문수량 INTEGER,
          결제금액 INTEGER
        )
      `);
      console.log('Table created');
    }
  }

  return db;
};

// IndexedDB에 데이터베이스를 저장하는 함수
const saveDatabase = async () => {
  const data = db.export();
  const buffer = new Uint8Array(data);

  const idb = await openIndexedDB();
  const tx = idb.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  store.put(buffer, 'sales_db');

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => {
      console.log('Database saved to IndexedDB');
      resolve();
    };
    tx.onerror = () => {
      console.error('Failed to save database to IndexedDB');
      reject(tx.error);
    };
  });
};

// IndexedDB에서 데이터베이스를 로드하는 함수
const loadDatabase = async () => {
  const idb = await openIndexedDB();
  const tx = idb.transaction('databases', 'readonly');
  const store = tx.objectStore('databases');
  const request = store.get('sales_db');

  return new Promise<Uint8Array | null>((resolve, reject) => {
    request.onsuccess = () => {
      if (request.result) {
        resolve(new Uint8Array(request.result));
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      console.error('Failed to load database from IndexedDB');
      reject(request.error);
    };
  });
};

// IndexedDB 연결 함수
const openIndexedDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('my_database', 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('databases')) {
        db.createObjectStore('databases');
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Failed to open IndexedDB');
      reject(request.error);
    };
  });
};

export const getData = async (): Promise<ApiResponse | null> => {
  const db = await initDB();
  const results = db.exec('SELECT * FROM sales');
  if (!results.length) return null;

  return {
    code: '200',
    message: 'success',
    data: {
      result_list: results[0].values.map((row: any[]) => ({
        주문날짜: row[1],
        주문요일: row[2],
        주문시간: row[3],
        주문번호: row[4],
        매장명: row[5],
        매장유형: row[6],
        매장상태: row[7],
        매장지역: row[8],
        매장상권: row[9],
        주문채널: row[10],
        주문방식: row[11],
        메뉴구분: row[12],
        메뉴카테고리: row[13],
        메뉴명: row[14],
        옵션여부: row[15],
        주문수량: row[16],
        결제금액: row[17],
      })),
    },
  };
};

export const saveData = async (data: {
  data: { result_list: SalesData[] };
}): Promise<void> => {
  const db = await initDB();

  db.run('DELETE FROM sales');

  const stmt = db.prepare(`
    INSERT INTO sales (
      주문날짜, 주문요일, 주문시간, 주문번호, 매장명, 매장유형, 
      매장상태, 매장지역, 매장상권, 주문채널, 주문방식, 메뉴구분,
      메뉴카테고리, 메뉴명, 옵션여부, 주문수량, 결제금액
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const BATCH_SIZE = 100;
  const rows = data.data.result_list;

  console.log(`Starting batch insert of ${rows.length} rows...`);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${i / BATCH_SIZE + 1}/${Math.ceil(
        rows.length / BATCH_SIZE
      )}`
    );

    db.run('BEGIN TRANSACTION');

    // eslint-disable-next-line no-restricted-syntax
    for (const row of batch) {
      stmt.run([
        row.주문날짜,
        row.주문요일,
        row.주문시간,
        row.주문번호,
        row.매장명,
        row.매장유형,
        row.매장상태,
        row.매장지역,
        row.매장상권,
        row.주문채널,
        row.주문방식,
        row.메뉴구분,
        row.메뉴카테고리,
        row.메뉴명,
        row.옵션여부,
        row.주문수량,
        row.결제금액,
      ]);
    }

    db.run('COMMIT');
  }

  stmt.free();
  console.log('Batch insert completed');

  await saveDatabase();
};

export type QueryResult = Array<Array<string | number>>;

export const executeQuery = async (query: string): Promise<QueryResult> => {
  const db = await initDB();

  try {
    console.log('Executing query:', query);
    const startTime = performance.now();

    // const results = db.exec(query);
    const results = db.exec(query);

    const endTime = performance.now();
    console.log(`Query executed in ${(endTime - startTime).toFixed(2)}ms`);

    return results[0]?.values || [];
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

// 대화 히스토리 저장 함수
export const saveConversationHistory = async (
  history: ConversationHistory[]
) => {
  const db = await initDB();

  // conversations 테이블이 없다면 생성
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT,
      chart_data TEXT,
      table_data TEXT,
      timestamp INTEGER
    )
  `);

  // 기존 데이터 삭제
  db.run('DELETE FROM conversations');

  // 새로운 데이터 저장
  const stmt = db.prepare(`
    INSERT INTO conversations (question, chart_data, table_data, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  history.forEach(item => {
    stmt.run([
      item.question,
      JSON.stringify(item.chartData),
      JSON.stringify(item.tableData),
      item.timestamp,
    ]);
  });

  stmt.free();
  await saveDatabase();
};

// 대화 히스토리 불러오기 함수
export const loadConversationHistory = async (): Promise<
  ConversationHistory[]
> => {
  const db = await initDB();

  try {
    const results = db.exec(`
      SELECT question, chart_data, table_data, timestamp 
      FROM conversations 
      ORDER BY timestamp ASC
    `);

    if (results.length === 0) return [];

    return results[0].values.map((row: any[]) => ({
      question: row[0],
      chartData: JSON.parse(row[1]),
      tableData: JSON.parse(row[2]),
      timestamp: row[3],
    }));
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return [];
  }
};

// 대화 히스토리 삭제 함수 추가
export const clearConversationHistory = async () => {
  const db = await initDB();
  try {
    db.run('DROP TABLE IF EXISTS conversations');
    await saveDatabase();
    console.log('Conversation history cleared');
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
};
