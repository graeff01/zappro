/**
 * Utilitários para manipulação de datas
 */

import { TIME_CONVERSION, EXCEL_EPOCH } from '../constants';

/**
 * Converte uma data em string ou número serial do Excel para objeto Date
 * @param {string|number} dateString - Data em formato DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD ou número serial do Excel
 * @returns {Date|null} Objeto Date ou null se inválido
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  try {
    let parsedDate;

    // Formato DD/MM/YYYY ou DD-MM-YYYY ou YYYY-MM-DD
    if (typeof dateString === 'string' && (dateString.includes('/') || dateString.includes('-'))) {
      const separator = dateString.includes('/') ? '/' : '-';
      const parts = dateString.split(separator);

      if (parts.length === 3) {
        // Verificar se é DD/MM/YYYY ou YYYY-MM-DD
        if (parts[2].length === 4) {
          // DD/MM/YYYY
          parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        } else if (parts[0].length === 4) {
          // YYYY-MM-DD
          parsedDate = new Date(parts[0], parts[1] - 1, parts[2]);
        }
      }
    }
    // Formato de data do Excel (número serial)
    else if (!isNaN(dateString) && dateString > 0) {
      parsedDate = new Date(EXCEL_EPOCH.getTime() + dateString * TIME_CONVERSION.MS_IN_DAY);
    }

    // Validar se a data é válida
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate;
  } catch (error) {
    console.error('Erro ao fazer parse da data:', dateString, error);
    return null;
  }
};

/**
 * Calcula a diferença em dias entre uma data e hoje
 * @param {string|number} dateString - Data em formato DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD ou número serial do Excel
 * @returns {number|null} Número de dias ou null se inválido
 */
export const calculateDaysSince = (dateString) => {
  const parsedDate = parseDate(dateString);

  if (!parsedDate) return null;

  const today = new Date();
  const diffTime = today.getTime() - parsedDate.getTime();
  const diffDays = Math.floor(diffTime / TIME_CONVERSION.MS_IN_DAY);

  return diffDays >= 0 ? diffDays : null;
};

/**
 * Formata a quantidade de dias em uma string legível
 * @param {number|null} days - Número de dias
 * @returns {string} String formatada (ex: "1 dia", "3 meses", "2 anos")
 */
export const formatDaysToReadable = (days) => {
  if (days === null || days === undefined) return 'N/A';

  if (days === 0) return 'Hoje';
  if (days === 1) return '1 dia';
  if (days < TIME_CONVERSION.DAYS_IN_MONTH) return `${days} dias`;

  if (days < TIME_CONVERSION.DAYS_IN_YEAR) {
    const months = Math.floor(days / TIME_CONVERSION.DAYS_IN_MONTH);
    return months === 1 ? '1 mês' : `${months} meses`;
  }

  const years = Math.floor(days / TIME_CONVERSION.DAYS_IN_YEAR);
  return years === 1 ? '1 ano' : `${years} anos`;
};

/**
 * Obtém a data e hora atual formatadas em pt-BR
 * @returns {Object} Objeto com data e hora formatadas
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString('pt-BR'),
    time: now.toLocaleTimeString('pt-BR')
  };
};

/**
 * Formata uma data para string ISO (YYYY-MM-DD)
 * @param {Date} date - Objeto Date
 * @returns {string} Data formatada
 */
export const formatDateToISO = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};
