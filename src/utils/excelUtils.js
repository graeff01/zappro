/**
 * Utilitários para processamento de arquivos Excel
 */

import * as XLSX from 'xlsx';
import { ERROR_MESSAGES } from '../constants';

/**
 * Lê um arquivo Excel e retorna os dados em formato JSON
 * @param {File} file - Arquivo Excel
 * @returns {Promise<Array>} Promise com array de objetos JSON
 */
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Arquivo não fornecido'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData || jsonData.length === 0) {
          reject(new Error('Arquivo Excel vazio ou sem dados'));
          return;
        }

        resolve(jsonData);
      } catch (error) {
        console.error('Erro ao processar Excel:', error);
        reject(new Error(ERROR_MESSAGES.FILE_PROCESSING));
      }
    };

    reader.onerror = () => {
      reject(new Error(ERROR_MESSAGES.FILE_PROCESSING));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * Valida se os campos esperados existem nos dados
 * @param {Array} data - Dados do Excel
 * @param {Array} requiredFields - Campos obrigatórios
 * @returns {Object} { isValid: boolean, missingFields: Array }
 */
export const validateExcelFields = (data, requiredFields) => {
  if (!data || data.length === 0) {
    return { isValid: false, missingFields: requiredFields };
  }

  const firstRow = data[0];
  const existingFields = Object.keys(firstRow);
  const missingFields = requiredFields.filter(field => !existingFields.includes(field));

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Exporta dados para arquivo Excel
 * @param {Object} workbookData - Objeto com sheets { sheetName: data }
 * @param {string} fileName - Nome do arquivo
 */
export const exportToExcel = (workbookData, fileName) => {
  try {
    const wb = XLSX.utils.book_new();

    Object.entries(workbookData).forEach(([sheetName, data]) => {
      let ws;

      // Se data é array de arrays (para sheet_to_aoa)
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        ws = XLSX.utils.aoa_to_sheet(data);
      }
      // Se data é array de objetos (para json_to_sheet)
      else if (Array.isArray(data) && data.length > 0) {
        ws = XLSX.utils.json_to_sheet(data);
      }
      // Caso contrário, criar sheet vazio
      else {
        ws = XLSX.utils.aoa_to_sheet([['Sem dados']]);
      }

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, fileName);
    return true;
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return false;
  }
};

/**
 * Sanitiza valores numéricos de células do Excel
 * @param {any} value - Valor da célula
 * @param {number} defaultValue - Valor padrão se inválido
 * @returns {number} Valor numérico sanitizado
 */
export const sanitizeNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Sanitiza valores de string de células do Excel
 * @param {any} value - Valor da célula
 * @param {string} defaultValue - Valor padrão se inválido
 * @returns {string} String sanitizada
 */
export const sanitizeString = (value, defaultValue = '') => {
  return value ? String(value).trim() : defaultValue;
};
