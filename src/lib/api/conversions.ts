import { supabase } from '../supabase';
import type { Conversion } from '../../types';
import { verifyWebsiteOwnership } from './websites';

export async function createConversion(data: Omit<Conversion, 'id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  try {
    // First verify website ownership
    await verifyWebsiteOwnership(data.website_id, user.id);

    // Create conversion
    const { data: conversion, error } = await supabase
      .from('conversions')
      .insert([{
        website_id: data.website_id,
        title: data.title,
        trigger_type: data.trigger_type,
        event_type: data.event_type,
        configuration: data.configuration || {}
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return conversion;
  } catch (error) {
    console.error('Create conversion error:', error);
    throw new Error('Failed to create conversion. Please try again.');
  }
}