/**
 * Hook customizado para gerenciar análise de dados de imóveis
 */

import { useState, useCallback, useMemo } from 'react';
import {
  filterSponsoredProperties,
  filterInactiveProperties,
  classifyProperty,
  calculateGeneralStats,
  groupByNeighborhood,
  groupByAdType,
  sortByPerformance,
  separateByCategory,
  findPropertyByCode
} from '../utils/analysisUtils';
import { calculateDaysSince } from '../utils/dateUtils';
import { sanitizeNumber, sanitizeString } from '../utils/excelUtils';

/**
 * Hook para gerenciar a análise completa de dados
 * @param {Object} criterios - Critérios de classificação
 * @returns {Object} { analysis, analyzeData }
 */
export const useAnalysis = (criterios) => {
  const [analysis, setAnalysis] = useState(null);

  /**
   * Processa os dados e gera a análise completa
   */
  const analyzeData = useCallback((rawData, leadsData = null, estoqueData = null) => {
    if (!rawData || rawData.length === 0) {
      console.warn('Dados vazios para análise');
      return null;
    }

    try {
      // Filtrar imóveis patrocinados
      const patrocinados = filterSponsoredProperties(rawData);

      // Mapear imóveis com informações de performance
      const comPerformance = patrocinados.map(row => {
        // Calcular tempo desde criação
        const dataCriacao = row['Criação'];
        const diasDesdeAnuncio = calculateDaysSince(dataCriacao);

        // Calcular dias desde última atualização
        const dataUltimaAtualizacao = row['Última atualização'];
        const diasSemAtualizacao = calculateDaysSince(dataUltimaAtualizacao);

        // Buscar leads orgânicos
        const codigo = sanitizeString(row['Código do Imóvel']);
        const imovelLeads = findPropertyByCode(leadsData, codigo, 'COD IMOVEL');
        const leadsOrganicos = imovelLeads ? sanitizeNumber(imovelLeads['LEAD']) : 0;

        // Buscar dados do estoque
        const dadosEstoque = findPropertyByCode(estoqueData, codigo, 'CÓDIGO');
        const diasEmEstoque = dadosEstoque ? sanitizeNumber(dadosEstoque['DIAS EM ESTOQUE']) : null;

        const views = sanitizeNumber(row['Total de visualizações']);
        const contatos = sanitizeNumber(row['Total de contatos']);

        return {
          codigo,
          endereco: `${sanitizeString(row['Endereço'])}, ${sanitizeString(row['Bairro'])}`,
          bairro: sanitizeString(row['Bairro'], 'Não informado'),
          tipo: sanitizeString(row['Tipo do anúncio']),
          tipoImovel: sanitizeString(row['Tipo do imóvel']),
          views,
          contatos,
          semAtualizacao: row['Sem atualização há mais de 30 dias'],
          diasSemAtualizacao,
          diasDesdeAnuncio,
          fotos: sanitizeNumber(row['Número de fotos']),
          valor: sanitizeNumber(row['Valor de Venda']),
          taxaConversao: views > 0 ? ((contatos / views) * 100).toFixed(1) : 0,
          leadsOrganicos,
          diasEmEstoque
        };
      });

      // Classificar cada imóvel
      const todosImoveis = comPerformance.map(imovel => ({
        ...imovel,
        ...classifyProperty(imovel.contatos, criterios)
      }));

      // Ordenar por performance
      const todosImoveisOrdenados = sortByPerformance(todosImoveis);

      // Separar por categoria
      const { topPerformers, performanceMedia, baixaPerformance } = separateByCategory(
        comPerformance,
        criterios
      );

      // Filtrar inativos
      const inativos = filterInactiveProperties(rawData);

      // Calcular estatísticas gerais
      const resumo = calculateGeneralStats(comPerformance);

      // Agrupar por bairro
      const bairrosPerformance = groupByNeighborhood(comPerformance);

      // Agrupar por tipo de anúncio
      const graficoPizza = groupByAdType(patrocinados);

      const analiseCompleta = {
        resumo,
        todosImoveis: todosImoveisOrdenados,
        topPerformers,
        performanceMedia,
        baixaPerformance,
        inativos,
        bairrosPerformance,
        graficoPizza
      };

      setAnalysis(analiseCompleta);
      return analiseCompleta;

    } catch (error) {
      console.error('Erro ao analisar dados:', error);
      return null;
    }
  }, [criterios]);

  return {
    analysis,
    analyzeData
  };
};
