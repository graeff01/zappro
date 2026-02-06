/**
 * Utilitários de validação de dados
 */

import { EXPECTED_FIELDS } from '../constants';

/**
 * Valida campos do relatório ZAP
 * @param {Array} data - Dados da planilha
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export const validateZapReport = (data) => {
  const errors = [];

  if (!data || !Array.isArray(data) || data.length === 0) {
    errors.push('Planilha vazia ou formato inválido');
    return { isValid: false, errors };
  }

  const firstRow = data[0];
  const existingFields = Object.keys(firstRow);

  // Verificar campos obrigatórios
  const missingFields = EXPECTED_FIELDS.ZAP_REPORT.filter(
    field => !existingFields.includes(field)
  );

  if (missingFields.length > 0) {
    errors.push(`Campos faltando na planilha: ${missingFields.join(', ')}`);
  }

  // Validar se há pelo menos um imóvel ativo
  const hasActiveProperties = data.some(
    row => row['Status do anúncio'] === 'Ativo'
  );

  if (!hasActiveProperties) {
    errors.push('Nenhum imóvel ativo encontrado na planilha');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida campos do relatório de Leads
 * @param {Array} data - Dados da planilha
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export const validateLeadsReport = (data) => {
  const errors = [];

  if (!data || !Array.isArray(data) || data.length === 0) {
    errors.push('Planilha vazia ou formato inválido');
    return { isValid: false, errors };
  }

  const firstRow = data[0];
  const existingFields = Object.keys(firstRow);

  const missingFields = EXPECTED_FIELDS.LEADS_REPORT.filter(
    field => !existingFields.includes(field)
  );

  if (missingFields.length > 0) {
    errors.push(`Campos faltando na planilha: ${missingFields.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida campos do relatório de Estoque
 * @param {Array} data - Dados da planilha
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export const validateEstoqueReport = (data) => {
  const errors = [];

  if (!data || !Array.isArray(data) || data.length === 0) {
    errors.push('Planilha vazia ou formato inválido');
    return { isValid: false, errors };
  }

  const firstRow = data[0];
  const existingFields = Object.keys(firstRow);

  const missingFields = EXPECTED_FIELDS.ESTOQUE_REPORT.filter(
    field => !existingFields.includes(field)
  );

  if (missingFields.length > 0) {
    errors.push(`Campos faltando na planilha: ${missingFields.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados numéricos de um imóvel
 * @param {Object} property - Dados do imóvel
 * @returns {Object} { isValid: boolean, warnings: Array }
 */
export const validatePropertyData = (property) => {
  const warnings = [];

  // Validar visualizações
  if (property.views < 0) {
    warnings.push(`Código ${property.codigo}: Visualizações negativas`);
  }

  // Validar contatos
  if (property.contatos < 0) {
    warnings.push(`Código ${property.codigo}: Contatos negativos`);
  }

  // Validar fotos
  if (property.fotos < 1) {
    warnings.push(`Código ${property.codigo}: Sem fotos cadastradas`);
  }

  // Validar taxa de conversão
  if (property.views > 0 && property.contatos > property.views) {
    warnings.push(`Código ${property.codigo}: Mais contatos que visualizações (inconsistência)`);
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
};

/**
 * Valida conjunto completo de dados de análise
 * @param {Array} properties - Lista de imóveis
 * @returns {Object} { isValid: boolean, warnings: Array, stats: Object }
 */
export const validateAnalysisData = (properties) => {
  const warnings = [];
  const stats = {
    total: properties.length,
    withoutPhotos: 0,
    withoutContacts: 0,
    withoutViews: 0,
    inconsistencies: 0
  };

  properties.forEach(property => {
    const validation = validatePropertyData(property);

    if (!validation.isValid) {
      warnings.push(...validation.warnings);
      stats.inconsistencies++;
    }

    if (property.fotos < 1) stats.withoutPhotos++;
    if (property.contatos === 0) stats.withoutContacts++;
    if (property.views === 0) stats.withoutViews++;
  });

  return {
    isValid: warnings.length === 0,
    warnings,
    stats
  };
};
