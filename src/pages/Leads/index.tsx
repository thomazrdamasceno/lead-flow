import React from 'react';
import { useLeads } from './hooks/useLeads';
import { LeadsList } from './components/LeadsList';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: leads, isLoading } = useLeads(user?.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
      </div>

      <LeadsList leads={leads || []} />
    </div>
  );
};