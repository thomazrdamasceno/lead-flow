import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { getApiExample } from '../../../config/api';
import type { Website } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';

interface ApiConfigurationProps {
  website: Website;
}

export const ApiConfiguration: React.FC<ApiConfigurationProps> = ({ website }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const { data: apiKeys, refetch } = useQuery({
    queryKey: ['api-keys', website.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('website_id', website.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createApiKey = async (data: { name: string }) => {
    try {
      const key = crypto.randomUUID().replace(/-/g, '');
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          website_id: website.id,
          name: data.name,
          key
        });

      if (error) throw error;

      reset();
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar chave API');
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Falha ao deletar chave API:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Configuração da API</h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Chave API</span>
        </Button>
      </div>

      {apiKeys?.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Nenhuma chave API criada ainda</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {apiKeys?.map((apiKey) => (
            <div key={apiKey.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{apiKey.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Criada em: {new Date(apiKey.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => copyToClipboard(apiKey.key)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteApiKey(apiKey.id)}
                    variant="danger"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Exemplo de Uso:</p>
                <pre className="mt-2 p-4 bg-gray-50 rounded-md text-sm overflow-x-auto">
                  {getApiExample(apiKey.key)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Chave API"
      >
        <form onSubmit={handleSubmit(createApiKey)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <FormField
            label="Nome da Chave"
            name="name"
            register={register('name', { required: 'Nome é obrigatório' })}
            placeholder="ex: Chave de Produção"
          />

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Criar Chave API
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};