import React from 'react';
import type { Website, Conversion } from '../../../types';

interface ConversionsListProps {
  conversions: Conversion[];
  websites: Website[];
}

export const ConversionsList: React.FC<ConversionsListProps> = ({ 
  conversions,
  websites 
}) => {
  if (!conversions.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma conversão cadastrada</h2>
        <p className="text-gray-600">Clique no botão acima para adicionar sua primeira conversão.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversão
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Website
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carregar em
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gatilho
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evento
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {conversions.map((conversion) => (
            <tr key={conversion.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {conversion.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {websites.find(w => w.id === conversion.website_id)?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.configuration.loadOn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.trigger_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.event_type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};