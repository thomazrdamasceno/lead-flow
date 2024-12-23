import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ConversionsList } from './components/ConversionsList';
import { ConversionForm } from './components/ConversionForm';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useWebsites } from '../../hooks/useWebsites';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useConversions } from './hooks/useConversions';

export const ConversionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: websites, isLoading: websitesLoading } = useWebsites(user?.id);
  const { data: conversions, isLoading: conversionsLoading, refetch } = useConversions(user?.id);

  if (websitesLoading || conversionsLoading) {
    return <LoadingSpinner />;
  }

  if (!websites?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum website encontrado</h2>
        <p className="text-gray-600">Adicione um website antes de criar conversões.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Conversões</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conversão</span>
        </button>
      </div>

      <ConversionsList 
        conversions={conversions || []} 
        websites={websites || []} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Conversão"
      >
        <ConversionForm 
          websites={websites || []}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};