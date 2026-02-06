/**
 * Componente de Seção de Gráficos
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../constants';

/**
 * Seção de gráficos (Pizza e Barras)
 * @param {Object} props
 * @param {Array} props.pieData - Dados para gráfico de pizza
 * @param {Array} props.barData - Dados para gráfico de barras
 */
const ChartsSection = ({ pieData, barData }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Gráfico de Pizza - Tipos de Anúncio */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quantidade por Tipo de Anúncio</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} imóveis`, 'Quantidade']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras - Performance por Bairro */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-500" />
          Performance por Bairro
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bairro" angle={-45} textAnchor="end" height={80} fontSize={12} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="mediaContatos" fill="#8b5cf6" name="Média Contatos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
