import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createConversion } from '../../../../lib/api';
import { FormField } from '../../../../components/ui/FormField';
import { Settings } from './Settings';
import type { Website } from '../../../../types';

interface ConversionFormProps {
  websites: Website[];
  onSuccess?: () => void;
}

export const ConversionForm: React.FC<ConversionFormProps> = ({ 
  websites,
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'product' | 'advanced'>('settings');
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      
      if (!data.websiteId) {
        throw new Error('Please select a website');
      }

      await createConversion({
        website_id: data.websiteId,
        title: data.title,
        trigger_type: data.triggerType,
        event_type: data.eventType,
        configuration: {
          loadOn: data.loadOn,
          triggerConfig: {},
          productInfo: {},
          advanced: {},
        },
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversion');
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <FormField
        label="Website"
        name="websiteId"
        type="select"
        register={register('websiteId', { 
          required: 'Website é obrigatório' 
        })}
        error={errors.websiteId}
        options={websites.map(website => ({
          value: website.id,
          label: website.name
        }))}
      />

      <FormField
        label="Título"
        name="title"
        register={register('title', { 
          required: 'Título é obrigatório' 
        })}
        error={errors.title}
      />

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Configurações
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('product')}
            className={`${
              activeTab === 'product'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Produto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`${
              activeTab === 'advanced'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Avançado
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'settings' && <Settings register={register} errors={errors} />}
        {activeTab === 'product' && (
          <div className="text-sm text-gray-600">
            <p>Configurações de produto serão implementadas em breve.</p>
          </div>
        )}
        {activeTab === 'advanced' && (
          <div className="text-sm text-gray-600">
            <p>Configurações avançadas serão implementadas em breve.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Conversão'}
        </button>
      </div>
    </form>
  );
};