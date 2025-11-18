/**
 * Utilitários para análise de dados de imóveis
 */

import { PERFORMANCE_CATEGORIES, AD_STATUS, AD_TYPES } from '../constants';
import { sanitizeNumber, sanitizeString } from './excelUtils';

/**
 * Filtra imóveis patrocinados ativos
 * @param {Array} data - Dados brutos do Excel
 * @returns {Array} Imóveis patrocinados ativos
 */
export const filterSponsoredProperties = (data) => {
  return data.filter(row =>
    row['Tipo do anúncio'] &&
    row['Tipo do anúncio'] !== AD_TYPES.STANDARD &&
    row['Status do anúncio'] === AD_STATUS.ACTIVE
  );
};

/**
 * Filtra imóveis inativos
 * @param {Array} data - Dados brutos do Excel
 * @param {number} limit - Limite de resultados
 * @returns {Array} Imóveis inativos
 */
export const filterInactiveProperties = (data, limit = 15) => {
  return data
    .filter(row => row['Status do anúncio'] === AD_STATUS.INACTIVE)
    .slice(0, limit)
    .map(row => ({
      codigo: sanitizeString(row['Código do Imóvel']),
      endereco: `${sanitizeString(row['Endereço'])}, ${sanitizeString(row['Bairro'])}`,
      tipo: sanitizeString(row['Tipo do imóvel']),
      bairro: sanitizeString(row['Bairro'], 'Não informado'),
      fotos: sanitizeNumber(row['Número de fotos']),
      valor: sanitizeNumber(row['Valor de Venda'])
    }));
};

/**
 * Classifica um imóvel baseado em critérios de performance
 * @param {number} contatos - Número de contatos
 * @param {Object} criterios - Critérios de classificação
 * @returns {Object} Categoria, cor e prioridade
 */
export const classifyProperty = (contatos, criterios) => {
  if (contatos >= criterios.contatosAlto) {
    return {
      categoria: PERFORMANCE_CATEGORIES.TOP.label,
      categoriaCor: PERFORMANCE_CATEGORIES.TOP.color,
      prioridade: PERFORMANCE_CATEGORIES.TOP.priority
    };
  } else if (contatos >= criterios.contatosMedio) {
    return {
      categoria: PERFORMANCE_CATEGORIES.MEDIUM.label,
      categoriaCor: PERFORMANCE_CATEGORIES.MEDIUM.color,
      prioridade: PERFORMANCE_CATEGORIES.MEDIUM.priority
    };
  } else {
    return {
      categoria: PERFORMANCE_CATEGORIES.LOW.label,
      categoriaCor: PERFORMANCE_CATEGORIES.LOW.color,
      prioridade: PERFORMANCE_CATEGORIES.LOW.priority
    };
  }
};

/**
 * Calcula estatísticas gerais
 * @param {Array} properties - Lista de imóveis
 * @returns {Object} Estatísticas gerais
 */
export const calculateGeneralStats = (properties) => {
  const total = properties.length;

  const totalViews = properties.reduce((sum, prop) => sum + prop.views, 0);
  const totalContacts = properties.reduce((sum, prop) => sum + prop.contatos, 0);

  const avgViews = total > 0 ? Math.round(totalViews / total) : 0;
  const avgContacts = total > 0 ? (totalContacts / total).toFixed(1) : 0;
  const conversionRate = totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(2) : 0;

  return {
    totalPatrocinados: total,
    totalViews,
    totalContatos: totalContacts,
    mediaViews: avgViews,
    mediaContatos: avgContacts,
    taxaConversaoGeral: conversionRate
  };
};

/**
 * Agrupa imóveis por bairro e calcula performance
 * @param {Array} properties - Lista de imóveis
 * @param {number} limit - Limite de resultados
 * @returns {Array} Performance por bairro
 */
export const groupByNeighborhood = (properties, limit = 10) => {
  const neighborhoodMap = {};

  properties.forEach(property => {
    const bairro = property.bairro;

    if (!neighborhoodMap[bairro]) {
      neighborhoodMap[bairro] = {
        total: 0,
        contatos: 0,
        views: 0
      };
    }

    neighborhoodMap[bairro].total += 1;
    neighborhoodMap[bairro].contatos += property.contatos;
    neighborhoodMap[bairro].views += property.views;
  });

  return Object.entries(neighborhoodMap)
    .map(([bairro, dados]) => ({
      bairro,
      total: dados.total,
      mediaContatos: (dados.contatos / dados.total).toFixed(1),
      mediaViews: Math.round(dados.views / dados.total)
    }))
    .sort((a, b) => parseFloat(b.mediaContatos) - parseFloat(a.mediaContatos))
    .slice(0, limit);
};

/**
 * Agrupa imóveis por tipo de anúncio
 * @param {Array} properties - Lista de imóveis (raw data)
 * @returns {Array} Dados para gráfico de pizza
 */
export const groupByAdType = (properties) => {
  const adTypeMap = properties.reduce((acc, row) => {
    const tipo = row['Tipo do anúncio'];
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(adTypeMap).map(([name, value]) => ({
    name,
    value,
    quantidade: value
  }));
};

/**
 * Ordena imóveis por performance (prioridade e contatos)
 * @param {Array} properties - Lista de imóveis
 * @returns {Array} Imóveis ordenados
 */
export const sortByPerformance = (properties) => {
  return [...properties].sort((a, b) => {
    if (a.prioridade !== b.prioridade) {
      return a.prioridade - b.prioridade;
    }
    return b.contatos - a.contatos;
  });
};

/**
 * Separa imóveis por categoria de performance
 * @param {Array} properties - Lista de imóveis com classificação
 * @param {Object} criterios - Critérios de classificação
 * @returns {Object} Imóveis separados por categoria
 */
export const separateByCategory = (properties, criterios) => {
  const topPerformers = properties
    .filter(p => p.contatos >= criterios.contatosAlto)
    .sort((a, b) => b.contatos - a.contatos);

  const mediumPerformance = properties
    .filter(p => p.contatos >= criterios.contatosMedio && p.contatos < criterios.contatosAlto)
    .sort((a, b) => b.contatos - a.contatos);

  const lowPerformance = properties
    .filter(p => p.contatos < criterios.contatosMedio)
    .sort((a, b) => a.contatos - b.contatos);

  return {
    topPerformers,
    performanceMedia: mediumPerformance,
    baixaPerformance: lowPerformance
  };
};

/**
 * Busca dados de um imóvel em outra planilha por código
 * @param {Array} data - Dados da planilha
 * @param {string} codigo - Código do imóvel
 * @param {string} codeField - Nome do campo de código
 * @returns {Object|null} Dados do imóvel ou null
 */
export const findPropertyByCode = (data, codigo, codeField) => {
  if (!data || !codigo) return null;

  return data.find(item =>
    String(item[codeField]) === String(codigo)
  ) || null;
};
