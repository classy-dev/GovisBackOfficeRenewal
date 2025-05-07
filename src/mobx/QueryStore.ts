import { makeAutoObservable } from 'mobx';
import {
  saveConversationHistory,
  loadConversationHistory,
  type ConversationHistory,
  clearConversationHistory,
} from '@ComponentFarm/llm/db';

export interface ChartData {
  type: 'bar' | 'donut' | 'line';
  data: any;
  options: {
    height?: string;
    barSize?: number;
    tickCount?: number;
    hasGrid?: boolean;
    isLegend?: boolean;
    isLabelList?: boolean;
    angle?: number;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    tooltipLabel?: string;
    diffSet?: Array<{
      name: string;
      dataKey: string;
      fill: string;
    }>;
    xTickFormatter?: (value: string) => string;
    fill?: string;
  };
  title?: string;
}

export class QueryStore {
  question: string = '';

  answer: string = '';

  streamingAnswer: string = '';

  isAnswerStreaming: boolean = false;

  isChartLoading: boolean = false;

  chartData: ChartData | null = null;

  answerResult: any[] = [];

  metadata: { columns?: string[]; units?: string[] } = {};

  isFunMode: boolean = false;

  lastAnswerTimestamp: number = 0;

  query: string = '';

  error: string | null = null;

  isHistorySaved: boolean = false;

  conversationHistory: ConversationHistory[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setQuestion(question: string) {
    this.question = question;
  }

  setAnswer(answer: string) {
    this.answer = answer;
    this.lastAnswerTimestamp = Date.now();
  }

  appendToStreamingAnswer(chunk: string) {
    this.streamingAnswer += chunk;
    this.answer = this.streamingAnswer;
    this.lastAnswerTimestamp = Date.now();
  }

  clearStreamingAnswer() {
    this.streamingAnswer = '';
  }

  setIsAnswerStreaming(isStreaming: boolean) {
    this.isAnswerStreaming = isStreaming;
  }

  setChartData(data: ChartData | null) {
    this.chartData = data;
  }

  setAnswerResult(result: any[]) {
    this.answerResult = result;
  }

  setMetadata(metadata: { columns?: string[]; units?: string[] }) {
    this.metadata = metadata;
  }

  setIsFunMode(isFunMode: boolean) {
    this.isFunMode = isFunMode;
  }

  setIsChartLoading(isLoading: boolean) {
    this.isChartLoading = isLoading;
  }

  setQuery(query: string) {
    this.query = query;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setHistorySaved(saved: boolean) {
    this.isHistorySaved = saved;
  }

  reset() {
    const prevFunMode = this.isFunMode;
    this.answer = '';
    this.chartData = null;
    this.answerResult = [];
    this.metadata = {};
    this.isFunMode = prevFunMode;
    this.query = '';
    this.error = null;
    this.isHistorySaved = false;
  }

  cleanup = async () => {
    this.question = '';
    this.answer = '';
    this.streamingAnswer = '';
    this.isAnswerStreaming = false;
    this.isChartLoading = false;
    this.chartData = null;
    this.answerResult = [];
    this.metadata = {};
    this.isFunMode = false;
    this.lastAnswerTimestamp = 0;
    this.query = '';
    this.error = null;
    this.isHistorySaved = false;
    this.conversationHistory = [];

    await clearConversationHistory();
  };

  addToHistory(conversation: {
    question: string;
    chartData: ChartData | null;
    answerResult: any[];
    metadata: { columns?: string[]; units?: string[] };
  }) {
    const formattedTableData =
      conversation.answerResult.length > 0
        ? {
            columns: conversation.metadata.columns || [],
            units: conversation.metadata.units || [],
            rows: conversation.answerResult.map(row => Object.values(row)),
          }
        : null;

    const formattedChartData = conversation.chartData
      ? {
          type: conversation.chartData.type,
          title: conversation.chartData.title || '',
          data: conversation.chartData.data.map((item: any) => ({
            label: item.item_label || item.fullLabel,
            value: item.value || item.base_sales_count,
            comparison_value: item.comparison_sales_count,
            increase_rate: item.increase_decrease_rate,
          })),
        }
      : null;

    const historyEntry: ConversationHistory = {
      question: conversation.question,
      chartData: formattedChartData,
      tableData: formattedTableData,
      timestamp: Date.now(),
    };

    console.log('Adding to history:', {
      question: historyEntry.question,
      chartData: {
        type: formattedChartData?.type,
        title: formattedChartData?.title,
        dataPoints: formattedChartData?.data.length,
        sampleData: formattedChartData?.data.slice(0, 2),
      },
      tableData: {
        columns: formattedTableData?.columns,
        rowCount: formattedTableData?.rows.length,
        sampleRows: formattedTableData?.rows.slice(0, 2),
      },
    });

    this.conversationHistory.push(historyEntry);
    this.saveHistory();
  }

  getFormattedHistory() {
    return this.conversationHistory.map(conv => ({
      question: conv.question,
      results: {
        chart: conv.chartData
          ? {
              type: conv.chartData.type,
              title: conv.chartData.title,
              data: conv.chartData.data,
            }
          : null,
        table: conv.tableData
          ? {
              columns: conv.tableData.columns,
              data: conv.tableData.rows.map(row =>
                row.map(
                  (value: any, index: number) =>
                    `${value}${conv.tableData?.units?.[index] || ''}`
                )
              ),
            }
          : null,
      },
    }));
  }

  async initializeHistory() {
    try {
      const history = await loadConversationHistory();
      this.conversationHistory = history;
      console.log('Loaded conversation history:', history);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      this.conversationHistory = [];
    }
  }

  async saveHistory() {
    try {
      await saveConversationHistory(this.conversationHistory);
      console.log('Saved conversation history:', this.conversationHistory);
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  }
}

export const queryStore = new QueryStore();
