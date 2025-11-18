/**
 * ZapPro Analyzer PRO - Aplicação Principal Refatorada
 * Sistema completo de análise e gestão de imóveis patrocinados
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Download, FileSpreadsheet, Target, Package } from 'lucide-react';

// Hooks customizados
import { useFileUpload } from './hooks/useFileUpload';
import { useAnalysis } from './hooks/useAnalysis';

// Componentes
import FileUploadCard from './components/FileUploadCard';
import StatCard from './components/StatCard';
import PerformanceTable from './components/PerformanceTable';
import ChartsSection from './components/ChartsSection';
import ActionPlan from './components/ActionPlan';
import StrategicInsights from './components/StrategicInsights';
import SettingsPanel from './components/SettingsPanel';
import AnalysisHistory from './components/AnalysisHistory';
import InstructionsCard from './components/InstructionsCard';

// Utils
import { exportToExcel } from './utils/excelUtils';
import { getCurrentDateTime, formatDateToISO, formatDaysToReadable } from './utils/dateUtils';

// Constantes
import { DEFAULT_CRITERIOS, HISTORY_CONFIG } from './constants';
import { TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';

export default function ZapProAnalyzer() {
  // Estados
  const [criterios, setCriterios] = useState(DEFAULT_CRITERIOS);
  const [showSettings, setShowSettings] = useState(false);
  const [historico, setHistorico] = useState([]);

  // Hook de análise
  const { analysis, analyzeData } = useAnalysis(criterios);

  // Hooks de upload de arquivos
  const zapUpload = useFileUpload(
    (data) => handleZapSuccess(data),
    (error) => console.error('Erro no upload ZAP:', error)
  );

  const leadsUpload = useFileUpload(
    () => {
      // Recalcular análise se já houver dados do ZAP
      if (zapUpload.data) {
        performAnalysis(zapUpload.data, leadsUpload.data, estoqueUpload.data);
      }
    },
    (error) => console.error('Erro no upload de Leads:', error)
  );

  const estoqueUpload = useFileUpload(
    () => {
      // Recalcular análise se já houver dados do ZAP
      if (zapUpload.data) {
        performAnalysis(zapUpload.data, leadsUpload.data, estoqueUpload.data);
      }
    },
    (error) => console.error('Erro no upload de Estoque:', error)
  );

  /**
   * Handler de sucesso do upload ZAP (obrigatório)
   */
  const handleZapSuccess = useCallback((data) => {
    performAnalysis(data, leadsUpload.data, estoqueUpload.data);
  }, [leadsUpload.data, estoqueUpload.data]);

  /**
   * Executa a análise e atualiza histórico
   */
  const performAnalysis = useCallback((zapData, leadsData, estoqueData) => {
    const resultado = analyzeData(zapData, leadsData, estoqueData);

    if (resultado) {
      const { date, time } = getCurrentDateTime();
      const novaAnalise = {
        data: date,
        hora: time,
        ...resultado.resumo
      };

      setHistorico(prev => [novaAnalise, ...prev].slice(0, HISTORY_CONFIG.MAX_ITEMS));
    }
  }, [analyzeData]);

  /**
   * Reanalisa dados quando critérios mudam
   */
  useEffect(() => {
    if (zapUpload.data) {
      performAnalysis(zapUpload.data, leadsUpload.data, estoqueUpload.data);
    }
  }, [criterios]);

  /**
   * Exporta relatório para Excel
   */
  const handleExportRelatorio = useCallback(() => {
    if (!analysis) return;

    const resumoData = [
      ['RELATÓRIO DE ANÁLISE ZAPPRO'],
      ['Data:', getCurrentDateTime().date],
      [''],
      ['RESUMO GERAL'],
      ['Total de Imóveis Patrocinados:', analysis.resumo.totalPatrocinados],
      ['Total de Visualizações:', analysis.resumo.totalViews],
      ['Total de Contatos:', analysis.resumo.totalContatos],
      ['Média de Visualizações/Imóvel:', analysis.resumo.mediaViews],
      ['Média de Contatos/Imóvel:', analysis.resumo.mediaContatos],
      ['Taxa de Conversão Geral:', analysis.resumo.taxaConversaoGeral + '%'],
      [''],
      ['DISTRIBUIÇÃO POR PERFORMANCE'],
      ['TOP Performers (A):', analysis.topPerformers.length],
      ['Performance Média (B):', analysis.performanceMedia.length],
      ['Baixa Performance (C):', analysis.baixaPerformance.length]
    ];

    const todosData = analysis.todosImoveis.map(i => ({
      'Categoria': i.categoria,
      'Código': i.codigo,
      'Endereço': i.endereco,
      'Tipo Anúncio': i.tipo,
      'Tempo no Ar': formatDaysToReadable(i.diasDesdeAnuncio),
      'Dias Sem Atualizar': i.diasSemAtualizacao !== null ? i.diasSemAtualizacao : 'N/A',
      'Fotos': i.fotos,
      'Visualizações': i.views,
      'Contatos': i.contatos,
      'Taxa Conversão': i.taxaConversao + '%',
      'Leads Orgânicos': i.leadsOrganicos || 0,
      'Dias em Estoque': i.diasEmEstoque || 'N/A'
    }));

    const workbookData = {
      'Resumo': resumoData,
      'Todos os Imóveis': todosData
    };

    const fileName = `Relatorio_ZapPro_${formatDateToISO(new Date())}.xlsx`;
    const success = exportToExcel(workbookData, fileName);

    if (success) {
      console.log('Relatório exportado com sucesso!');
    }
  }, [analysis]);

  /**
   * Reseta todos os dados para nova análise
   */
  const handleNovaAnalise = useCallback(() => {
    zapUpload.resetData();
    leadsUpload.resetData();
    estoqueUpload.resetData();
  }, [zapUpload, leadsUpload, estoqueUpload]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ZapPro Analyzer PRO
              </h1>
              <p className="text-gray-600">
                Sistema completo de análise e gestão de imóveis patrocinados
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
                Configurações
              </button>
            </div>
          </div>
        </div>

        {/* Painel de Configurações */}
        {showSettings && (
          <SettingsPanel
            criterios={criterios}
            onCriteriosChange={setCriterios}
          />
        )}

        {/* Tela de Upload (quando não há dados) */}
        {!zapUpload.data && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <FileUploadCard
                title="1. Relatório ZAP"
                description="Performance dos anúncios"
                onUpload={zapUpload.handleUpload}
                loading={zapUpload.loading}
                data={zapUpload.data}
                icon={FileSpreadsheet}
                borderColor="border-indigo-300 hover:border-indigo-500"
                iconColor="text-indigo-500"
                loadingColor="border-indigo-600"
                successColor="bg-indigo-50 text-indigo-800"
              />

              <FileUploadCard
                title="2. Relatório Leads"
                description="Leads orgânicos por imóvel"
                onUpload={leadsUpload.handleUpload}
                loading={leadsUpload.loading}
                data={leadsUpload.data}
                icon={Target}
                borderColor="border-green-300 hover:border-green-500"
                iconColor="text-green-500"
                loadingColor="border-green-600"
                successColor="bg-green-50 text-green-800"
              />

              <FileUploadCard
                title="3. Estoque"
                description="Dias em estoque e histórico"
                onUpload={estoqueUpload.handleUpload}
                loading={estoqueUpload.loading}
                data={estoqueUpload.data}
                icon={Package}
                borderColor="border-orange-300 hover:border-orange-500"
                iconColor="text-orange-500"
                loadingColor="border-orange-600"
                successColor="bg-orange-50 text-orange-800"
              />
            </div>

            <InstructionsCard />

            <AnalysisHistory history={historico} />
          </>
        )}

        {/* Tela de Análise (quando há dados e análise) */}
        {analysis && (
          <div className="space-y-6">
            {/* Botão de Exportar */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleExportRelatorio}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Exportar Relatório Excel
              </button>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                label="Imóveis Ativos"
                value={analysis.resumo.totalPatrocinados}
                icon={FileSpreadsheet}
                iconColor="text-blue-500"
              />
              <StatCard
                label="Total Visualizações"
                value={analysis.resumo.totalViews}
                subtitle={`Média: ${analysis.resumo.mediaViews}/imóvel`}
                icon={TrendingUp}
                iconColor="text-green-500"
              />
              <StatCard
                label="Total Contatos"
                value={analysis.resumo.totalContatos}
                subtitle={`Média: ${analysis.resumo.mediaContatos}/imóvel`}
                icon={CheckCircle}
                iconColor="text-purple-500"
              />
              <StatCard
                label="Taxa Conversão"
                value={`${analysis.resumo.taxaConversaoGeral}%`}
                icon={BarChart3}
                iconColor="text-orange-500"
              />
            </div>

            {/* Gráficos */}
            <ChartsSection
              pieData={analysis.graficoPizza}
              barData={analysis.bairrosPerformance}
            />

            {/* Plano de Ação */}
            <ActionPlan
              topCount={analysis.topPerformers.length}
              mediumCount={analysis.performanceMedia.length}
              lowCount={analysis.baixaPerformance.length}
            />

            {/* Tabela de Performance */}
            <PerformanceTable
              properties={analysis.todosImoveis}
              criterios={criterios}
              showLeads={!!leadsUpload.data}
            />

            {/* Insights Estratégicos */}
            <StrategicInsights
              lowPerformanceCount={analysis.baixaPerformance.length}
              topNeighborhood={analysis.bairrosPerformance[0]}
            />

            {/* Botões de Ação */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNovaAnalise}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all"
              >
                Fazer Nova Análise
              </button>

              <button
                onClick={handleExportRelatorio}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all"
              >
                Exportar Relatório Completo
              </button>
            </div>

            {/* Dica Pro */}
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600">
                <strong>Dica Pro:</strong> Salve este relatório e compare com a análise da próxima semana
                para acompanhar a evolução da sua performance!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
