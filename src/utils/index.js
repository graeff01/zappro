/**
 * Index de exportação de todos os utilitários
 */

// Date Utils
export {
  parseDate,
  calculateDaysSince,
  formatDaysToReadable,
  getCurrentDateTime,
  formatDateToISO
} from './dateUtils';

// Excel Utils
export {
  readExcelFile,
  validateExcelFields,
  exportToExcel,
  sanitizeNumber,
  sanitizeString
} from './excelUtils';

// Analysis Utils
export {
  filterSponsoredProperties,
  filterInactiveProperties,
  classifyProperty,
  calculateGeneralStats,
  groupByNeighborhood,
  groupByAdType,
  sortByPerformance,
  separateByCategory,
  findPropertyByCode
} from './analysisUtils';

// Validation Utils
export {
  validateZapReport,
  validateLeadsReport,
  validateEstoqueReport,
  validatePropertyData,
  validateAnalysisData
} from './validation';
