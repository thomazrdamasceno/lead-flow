import React, { useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { useWebsites } from '../../hooks/useWebsites';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { WebsiteForm } from './WebsiteForm';
import { EditWebsiteForm } from './components/EditWebsiteForm';
import { WebsiteDetails } from './components/WebsiteDetails';
import type { Website } from '../../types';

export const WebsitesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { data: websites, isLoading, refetch } = useWebsites(user?.id);

  const handleEdit = (website: Website) => {
    setSelectedWebsite(website);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setSelectedWebsite(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Websites</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Website</span>
        </button>
      </div>

      {websites?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum website cadastrado</h2>
          <p className="text-gray-600">Clique no botão acima para adicionar seu primeiro website.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domínio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pixel ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {websites?.map((website) => (
                <tr key={website.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {website.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {website.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {website.pixel_id || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(website.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(website)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedWebsite(website)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver Código
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Website"
      >
        <WebsiteForm 
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={!!selectedWebsite && !isEditing}
        onClose={() => setSelectedWebsite(null)}
        title="Detalhes do Website"
      >
        {selectedWebsite && <WebsiteDetails website={selectedWebsite} />}
      </Modal>

      <Modal
        isOpen={!!selectedWebsite && isEditing}
        onClose={handleCloseEdit}
        title="Editar Website"
      >
        {selectedWebsite && (
          <EditWebsiteForm
            website={selectedWebsite}
            onSuccess={() => {
              handleCloseEdit();
              refetch();
            }}
          />
        )}
      </Modal>
    </div>
  );
};