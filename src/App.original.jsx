import React, { useState } from 'react';
import { Upload, TrendingUp, AlertCircle, CheckCircle, BarChart3, FileSpreadsheet, Download, Settings, MapPin, Calendar, Target, Camera, Clock, Package } from 'lucide-react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ZapProAnalyzer() {
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [criterios, setCriterios] = useState({
    contatosAlto: 10,
    contatosMedio: 3,
    diasSemAtualizacao: 30
  });
  
  const [leadsData, setLeadsData] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(false);
  
  const [estoqueData, setEstoqueData] = useState(null);
  const [loadingEstoque, setLoadingEstoque] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setData(jsonData);
        const resultado = analyzeData(jsonData);
        
        const novaAnalise = {
          data: new Date().toLocaleDateString('pt-BR'),
          hora: new Date().toLocaleTimeString('pt-BR'),
          ...resultado.resumo
        };
        setHistorico(prev => [novaAnalise, ...prev].slice(0, 10));
        
        setLoading(false);
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setLoading(false);
    }
  };

  const handleLeadsUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoadingLeads(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setLeadsData(jsonData);
        setLoadingLeads(false);
        
        // Recalcular análise se já houver dados do ZAP
        if (data) {
          analyzeData(data);
        }
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Erro ao processar leads:', error);
      setLoadingLeads(false);
    }
  };

  const handleEstoqueUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoadingEstoque(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setEstoqueData(jsonData);
        setLoadingEstoque(false);
        
        // Recalcular análise se já houver dados do ZAP
        if (data) {
          analyzeData(data);
        }
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Erro ao processar estoque:', error);
      setLoadingEstoque(false);
    }
  };

  const calcularDiasDesdeData = (dataString) => {
    if (!dataString) return null;
    
    try {
      let dataAnuncio;
      
      // Formato DD/MM/YYYY ou DD-MM-YYYY
      if (dataString.includes('/') || dataString.includes('-')) {
        const separador = dataString.includes('/') ? '/' : '-';
        const partes = dataString.split(separador);
        if (partes.length === 3) {
          // Verificar se é DD/MM/YYYY ou YYYY-MM-DD
          if (partes[2].length === 4) {
            // DD/MM/YYYY
            dataAnuncio = new Date(partes[2], partes[1] - 1, partes[0]);
          } else if (partes[0].length === 4) {
            // YYYY-MM-DD
            dataAnuncio = new Date(partes[0], partes[1] - 1, partes[2]);
          }
        }
      }
      // Formato de data do Excel (número serial)
      else if (!isNaN(dataString) && dataString > 0) {
        const excelEpoch = new Date(1899, 11, 30);
        dataAnuncio = new Date(excelEpoch.getTime() + dataString * 86400000);
      }
      
      if (!dataAnuncio || isNaN(dataAnuncio.getTime())) {
        return null;
      }
      
      const hoje = new Date();
      const diferencaTempo = hoje.getTime() - dataAnuncio.getTime();
      const diferencaDias = Math.floor(diferencaTempo / (1000 * 3600 * 24));
      
      return diferencaDias >= 0 ? diferencaDias : null;
    } catch (error) {
      return null;
    }
  };

  const formatarTempoAnuncio = (dias) => {
    if (dias === null || dias === undefined) return 'N/A';
    
    if (dias === 0) return 'Hoje';
    if (dias === 1) return '1 dia';
    if (dias < 30) return `${dias} dias`;
    if (dias < 365) {
      const meses = Math.floor(dias / 30);
      return meses === 1 ? '1 mês' : `${meses} meses`;
    }
    const anos = Math.floor(dias / 365);
    return anos === 1 ? '1 ano' : `${anos} anos`;
  };

  // BUSCAR DADOS DO ESTOQUE POR CÓDIGO
  const buscarDadosEstoque = (codigo) => {
    if (!estoqueData) return null;
    
    const imovelEstoque = estoqueData.find(item => 
      String(item['CÓDIGO']) === String(codigo)
    );
    
    return imovelEstoque;
  };

  // BUSCAR LEADS POR CÓDIGO
  const buscarLeads = (codigo) => {
    if (!leadsData) return 0;
    
    const imovelLeads = leadsData.find(item => 
      String(item['COD IMOVEL']) === String(codigo)
    );
    
    return imovelLeads ? (imovelLeads['LEAD'] || 0) : 0;
  };

  const analyzeData = (rawData) => {
    const patrocinados = rawData.filter(row => 
      row['Tipo do anúncio'] && 
      row['Tipo do anúncio'] !== 'Padrão' &&
      row['Status do anúncio'] === 'Ativo'
    );

    const totalPatrocinados = patrocinados.length;
    const totalViews = patrocinados.reduce((sum, row) => {
      const views = Number(row['Total de visualizações']) || 0;
      return sum + views;
    }, 0);

    const totalContatos = patrocinados.reduce((sum, row) => {
      const contatos = Number(row['Total de contatos']) || 0;
      return sum + contatos;
    }, 0);
    
    const mediaViews = totalPatrocinados > 0 ? Math.round(totalViews / totalPatrocinados) : 0;
    const mediaContatos = totalPatrocinados > 0 ? (totalContatos / totalPatrocinados).toFixed(1) : 0;

    const comPerformance = patrocinados.map(row => {
      // Calcular tempo desde criação - CAMPO: "Criação"
      const dataCriacao = row['Criação'];
      const diasDesdeAnuncio = calcularDiasDesdeData(dataCriacao);
      
      // Calcular dias desde última atualização - CAMPO: "Última atualização"
      const dataUltimaAtualizacao = row['Última atualização'];
      const diasSemAtualizacao = calcularDiasDesdeData(dataUltimaAtualizacao);
      
      // Buscar leads orgânicos
      const codigo = row['Código do Imóvel'];
      const leadsOrganicos = buscarLeads(codigo);
      
      // Buscar dados do estoque
      const dadosEstoque = buscarDadosEstoque(codigo);
      
      return {
        codigo: codigo,
        endereco: `${row['Endereço'] || ''}, ${row['Bairro'] || ''}`,
        bairro: row['Bairro'] || 'Não informado',
        tipo: row['Tipo do anúncio'],
        tipoImovel: row['Tipo do imóvel'],
        views: Number(row['Total de visualizações']) || 0,
        contatos: Number(row['Total de contatos']) || 0,
        semAtualizacao: row['Sem atualização há mais de 30 dias'],
        diasSemAtualizacao: diasSemAtualizacao,
        diasDesdeAnuncio: diasDesdeAnuncio,
        fotos: row['Número de fotos'] || 0,
        valor: row['Valor de Venda'] || 0,
        taxaConversao: row['Total de visualizações'] > 0 
          ? ((row['Total de contatos'] / row['Total de visualizações']) * 100).toFixed(1)
          : 0,
        leadsOrganicos: leadsOrganicos,
        diasEmEstoque: dadosEstoque ? dadosEstoque['DIAS EM ESTOQUE'] : null
      };
    });

    // Classificar cada imóvel
    const todosImoveis = comPerformance.map(imovel => {
      let categoria = '';
      let categoriaCor = '';
      let prioridade = 0;
      
      if (imovel.contatos >= criterios.contatosAlto) {
        categoria = 'TOP Performance';
        categoriaCor = 'bg-green-600';
        prioridade = 1;
      } else if (imovel.contatos >= criterios.contatosMedio) {
        categoria = 'Performance Média';
        categoriaCor = 'bg-yellow-500';
        prioridade = 2;
      } else {
        categoria = 'Baixa Performance';
        categoriaCor = 'bg-red-600';
        prioridade = 3;
      }
      
      return {
        ...imovel,
        categoria,
        categoriaCor,
        prioridade
      };
    });

    todosImoveis.sort((a, b) => {
      if (a.prioridade !== b.prioridade) {
        return a.prioridade - b.prioridade;
      }
      return b.contatos - a.contatos;
    });

    const topPerformers = comPerformance
      .filter(i => i.contatos >= criterios.contatosAlto)
      .sort((a, b) => b.contatos - a.contatos);

    const performanceMedia = comPerformance
      .filter(i => i.contatos >= criterios.contatosMedio && i.contatos < criterios.contatosAlto)
      .sort((a, b) => b.contatos - a.contatos);

    const baixaPerformance = comPerformance
      .filter(i => i.contatos < criterios.contatosMedio)
      .sort((a, b) => a.contatos - b.contatos);

    const inativos = rawData
      .filter(row => row['Status do anúncio'] === 'Inativo')
      .slice(0, 15)
      .map(row => ({
        codigo: row['Código do Imóvel'],
        endereco: `${row['Endereço'] || ''}, ${row['Bairro'] || ''}`,
        tipo: row['Tipo do imóvel'],
        bairro: row['Bairro'] || 'Não informado',
        fotos: row['Número de fotos'] || 0,
        valor: row['Valor de Venda'] || 0
      }));

    const porBairro = {};
    comPerformance.forEach(imovel => {
      if (!porBairro[imovel.bairro]) {
        porBairro[imovel.bairro] = { total: 0, contatos: 0, views: 0 };
      }
      porBairro[imovel.bairro].total += 1;
      porBairro[imovel.bairro].contatos += imovel.contatos;
      porBairro[imovel.bairro].views += imovel.views;
    });

    const bairrosPerformance = Object.entries(porBairro)
      .map(([bairro, dados]) => ({
        bairro,
        total: dados.total,
        mediaContatos: (dados.contatos / dados.total).toFixed(1),
        mediaViews: Math.round(dados.views / dados.total)
      }))
      .sort((a, b) => b.mediaContatos - a.mediaContatos)
      .slice(0, 10);

    const tiposAnuncio = patrocinados.reduce((acc, row) => {
      const tipo = row['Tipo do anúncio'];
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    const graficoPizza = Object.entries(tiposAnuncio).map(([name, value]) => ({
      name,
      value,
      quantidade: value
    }));

    const analiseCompleta = {
      resumo: {
        totalPatrocinados,
        totalViews,
        totalContatos,
        mediaViews,
        mediaContatos,
        taxaConversaoGeral: totalViews > 0 ? ((totalContatos / totalViews) * 100).toFixed(2) : 0
      },
      todosImoveis,
      topPerformers,
      performanceMedia,
      baixaPerformance,
      inativos,
      bairrosPerformance,
      graficoPizza
    };

    setAnalysis(analiseCompleta);
    
    return analiseCompleta;
  };

  const exportarRelatorio = () => {
    if (!analysis) return;

    const wb = XLSX.utils.book_new();

    const resumoData = [
      ['RELATÓRIO DE ANÁLISE ZAPPRO'],
      ['Data:', new Date().toLocaleDateString('pt-BR')],
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
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

    if (analysis.todosImoveis && analysis.todosImoveis.length > 0) {
      const todosData = analysis.todosImoveis.map(i => ({
        'Categoria': i.categoria,
        'Código': i.codigo,
        'Endereço': i.endereco,
        'Tipo Anúncio': i.tipo,
        'Tempo no Ar': formatarTempoAnuncio(i.diasDesdeAnuncio),
        'Dias Sem Atualizar': i.diasSemAtualizacao !== null ? i.diasSemAtualizacao : 'N/A',
        'Fotos': i.fotos,
        'Visualizações': i.views,
        'Contatos': i.contatos,
        'Taxa Conversão': i.taxaConversao + '%',
        'Leads Orgânicos': i.leadsOrganicos || 0,
        'Dias em Estoque': i.diasEmEstoque || 'N/A'
      }));
      const wsTodos = XLSX.utils.json_to_sheet(todosData);
      XLSX.utils.book_append_sheet(wb, wsTodos, 'Todos os Imóveis');
    }

    XLSX.writeFile(wb, `Relatorio_ZapPro_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
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

        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Critérios de Classificação</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contatos para Alta Performance (A)
                </label>
                <input
                  type="number"
                  value={criterios.contatosAlto}
                  onChange={(e) => setCriterios({...criterios, contatosAlto: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contatos para Média Performance (B)
                </label>
                <input
                  type="number"
                  value={criterios.contatosMedio}
                  onChange={(e) => setCriterios({...criterios, contatosMedio: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias sem atualização (alerta)
                </label>
                <input
                  type="number"
                  value={criterios.diasSemAtualizacao}
                  onChange={(e) => setCriterios({...criterios, diasSemAtualizacao: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Ajuste os critérios conforme sua estratégia de negócio
            </p>
          </div>
        )}

        {!data && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-800">1. Relatório ZAP</h3>
                </div>
                <label className="flex flex-col items-center justify-center border-4 border-dashed border-indigo-300 rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition-all">
                  <Upload className="w-16 h-16 text-indigo-500 mb-3" />
                  <span className="text-lg font-semibold text-gray-700 mb-2">
                    Upload Relatório ZAP
                  </span>
                  <span className="text-sm text-gray-500 text-center">
                    Performance dos anúncios
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {loading && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-indigo-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Analisando...</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-800">2. Relatório Leads</h3>
                </div>
                <label className="flex flex-col items-center justify-center border-4 border-dashed border-green-300 rounded-xl p-8 cursor-pointer hover:border-green-500 transition-all">
                  <Upload className="w-16 h-16 text-green-500 mb-3" />
                  <span className="text-lg font-semibold text-gray-700 mb-2">
                    Upload Relatório Leads
                  </span>
                  <span className="text-sm text-gray-500 text-center">
                    Leads orgânicos por imóvel
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleLeadsUpload}
                    className="hidden"
                  />
                </label>
                {loadingLeads && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Processando...</p>
                  </div>
                )}
                {leadsData && (
                  <div className="mt-4 bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-semibold">
                      ✓ {leadsData.length} imóveis carregados
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-800">3. Estoque</h3>
                </div>
                <label className="flex flex-col items-center justify-center border-4 border-dashed border-orange-300 rounded-xl p-8 cursor-pointer hover:border-orange-500 transition-all">
                  <Upload className="w-16 h-16 text-orange-500 mb-3" />
                  <span className="text-lg font-semibold text-gray-700 mb-2">
                    Upload Estoque
                  </span>
                  <span className="text-sm text-gray-500 text-center">
                    Dias em estoque e histórico
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleEstoqueUpload}
                    className="hidden"
                  />
                </label>
                {loadingEstoque && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-orange-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Processando...</p>
                  </div>
                )}
                {estoqueData && (
                  <div className="mt-4 bg-orange-50 rounded-lg p-3">
                    <p className="text-sm text-orange-800 font-semibold">
                      ✓ {estoqueData.length} imóveis carregados
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">💡 Como usar:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li><strong>1.</strong> Faça upload do <strong>Relatório ZAP</strong> (obrigatório)</li>
                    <li><strong>2.</strong> Adicione o <strong>Relatório de Leads</strong> para ver leads orgânicos</li>
                    <li><strong>3.</strong> Adicione o <strong>Estoque</strong> para análise completa de timing</li>
                  </ol>
                  <p className="text-xs text-blue-600 mt-2">
                    Quanto mais dados, melhor a análise! 🚀
                  </p>
                </div>
              </div>
            </div>

            {historico.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Histórico de Análises
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {historico.slice(0, 4).map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-gray-700">{item.data}</span>
                        <span className="text-xs text-gray-500">{item.hora}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Ativos:</span>
                          <p className="font-semibold">{item.totalPatrocinados}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Contatos:</span>
                          <p className="font-semibold">{item.totalContatos}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Conv:</span>
                          <p className="font-semibold">{item.taxaConversaoGeral}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analisando seus dados...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <button
                onClick={exportarRelatorio}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Exportar Relatório Excel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Imóveis Ativos</span>
                  <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{analysis.resumo.totalPatrocinados}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Visualizações</span>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{analysis.resumo.totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Média: {analysis.resumo.mediaViews}/imóvel</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Contatos</span>
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{analysis.resumo.totalContatos}</p>
                <p className="text-xs text-gray-500 mt-1">Média: {analysis.resumo.mediaContatos}/imóvel</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Taxa Conversão</span>
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{analysis.resumo.taxaConversaoGeral}%</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quantidade por Tipo de Anúncio</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analysis.graficoPizza}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analysis.graficoPizza.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} imóveis`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  Performance por Bairro
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analysis.bairrosPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bairro" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mediaContatos" fill="#8b5cf6" name="Média Contatos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Plano de Ação desta Semana</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Manter Ativos</p>
                  <p className="text-3xl font-bold">{analysis.topPerformers.length}</p>
                  <p className="text-xs opacity-75 mt-1">Alta performance - Continue investindo</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Monitorar Próxima Semana</p>
                  <p className="text-3xl font-bold">{analysis.performanceMedia.length}</p>
                  <p className="text-xs opacity-75 mt-1">Performance média - Avaliar em 7 dias</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Pausar Agora</p>
                  <p className="text-3xl font-bold">{analysis.baixaPerformance.length}</p>
                  <p className="text-xs opacity-75 mt-1">Baixa performance - Substituir urgente</p>
                </div>
              </div>
              <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-sm opacity-90">Potencial de Otimização:</p>
                <p className="text-2xl font-bold mt-1">
                  +{(analysis.baixaPerformance.length * 4)} contatos/mês
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Substituindo por imóveis com performance média de 4 contatos/mês
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FileSpreadsheet className="w-6 h-6 text-indigo-600 mr-2" />
                Todos os Imóveis Patrocinados ({analysis.todosImoveis.length})
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Lista completa ordenada por performance - do melhor ao pior
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Endereço</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Tempo no Ar ZAP</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Dias s/ Atualizar VISTA</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Fotos</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Views</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Contatos</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Tax. Conv.</th>
                      {leadsData && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Leads Delivery.</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {analysis.todosImoveis.map((imovel, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${imovel.categoriaCor}`}>
                            {imovel.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{imovel.codigo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{imovel.endereco}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Clock className="w-4 h-4 text-blue-500" />
                            {formatarTempoAnuncio(imovel.diasDesdeAnuncio)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {imovel.diasSemAtualizacao !== null ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              imovel.diasSemAtualizacao > 30 ? 'bg-red-100 text-red-700' :
                              imovel.diasSemAtualizacao > 15 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {imovel.diasSemAtualizacao} dias
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                            imovel.fotos >= 15 ? 'text-green-600' : 
                            imovel.fotos >= 10 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            <Camera className="w-4 h-4" />
                            {imovel.fotos}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{imovel.views}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={`font-semibold ${
                            imovel.contatos >= criterios.contatosAlto ? 'text-green-600' :
                            imovel.contatos >= criterios.contatosMedio ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {imovel.contatos}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{imovel.taxaConversao}%</td>
                        {leadsData && (
                          <td className="px-4 py-3 text-center">
                            <span className={`font-bold ${
                              imovel.leadsOrganicos >= 5 ? 'text-green-600' :
                              imovel.leadsOrganicos >= 2 ? 'text-blue-600' :
                              'text-gray-400'
                            }`}>
                              {imovel.leadsOrganicos || 0}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Legenda:</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span><strong>Tempo no Ar:</strong> Dias desde criação do anúncio (ZAP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span><strong>Dias s/ Atualizar:</strong> Verde ≤15 | Amarelo ≤30 | Vermelho &gt;30</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4" />
                    <span><strong>Fotos:</strong> Verde ≥15 | Amarelo ≥10 | Vermelho &lt;10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Insights e Recomendações Estratégicas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Otimização de Budget</h4>
                  <p className="text-sm opacity-90">
                    Ao pausar os {analysis.baixaPerformance.length} imóveis de baixa performance e ativar 
                    novos substitutos, você pode aumentar sua taxa de conversão em até 40%.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Foco nos Melhores Bairros</h4>
                  <p className="text-sm opacity-90">
                    {analysis.bairrosPerformance[0]?.bairro} está performando melhor com média de{' '}
                    {analysis.bairrosPerformance[0]?.mediaContatos} contatos por imóvel. 
                    Considere aumentar investimento nesta região.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Qualidade das Fotos</h4>
                  <p className="text-sm opacity-90">
                    Imóveis com menos de 10 fotos tendem a ter menor performance. 
                    Atualize as fotos antes de patrocinar novamente.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Rotação Semanal</h4>
                  <p className="text-sm opacity-90">
                    Revisar e ajustar os patrocinados semanalmente pode aumentar o ROI em até 250%. 
                    Use este dashboard toda semana!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setData(null);
                  setAnalysis(null);
                  setLeadsData(null);
                  setEstoqueData(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all"
              >
                Fazer Nova Análise
              </button>
              
              <button
                onClick={exportarRelatorio}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all"
              >
                Exportar Relatório Completo
              </button>
            </div>

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