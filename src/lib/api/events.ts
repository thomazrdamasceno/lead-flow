import { supabase } from '../supabase';

interface EventData {
  event: string;
  url: string;
  website_id: string;
  lead?: {
    email?: string;
    name?: string;
    phone?: string;
    custom_data?: Record<string, any>;
  };
  data?: Record<string, any>;
}

export async function createEvent(data: EventData, apiKey: string) {
  // First verify API key
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('website_id')
    .eq('key', apiKey)
    .eq('enabled', true)
    .single();

  if (keyError || !keyData) {
    throw new Error('Invalid or disabled API key');
  }

  if (keyData.website_id !== data.website_id) {
    throw new Error('API key does not match website');
  }

  // Start transaction
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .upsert(
      {
        website_id: data.website_id,
        email: data.lead?.email,
        name: data.lead?.name,
        phone: data.lead?.phone,
        custom_data: data.lead?.custom_data || {},
      },
      {
        onConflict: 'website_id, email',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (leadError) {
    throw new Error('Failed to create/update lead');
  }

  // Create event
  const { error: eventError } = await supabase
    .from('events')
    .insert({
      website_id: data.website_id,
      lead_id: lead.id,
      event_type: data.event,
      page_url: data.url,
      data: data.data || {},
    });

  if (eventError) {
    throw new Error('Failed to create event');
  }

  // Update API key last used timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key', apiKey);

  return { lead, success: true };
}