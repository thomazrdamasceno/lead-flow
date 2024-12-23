import { supabase } from './supabase';
import type { Website, Conversion } from '../types';

export async function createWebsite(data: Omit<Website, 'id' | 'created_at'>) {
  const { data: website, error } = await supabase
    .from('websites')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Create website error:', error);
    if (error.code === '23503') {
      throw new Error('User account not properly initialized. Please try logging out and back in.');
    }
    throw new Error('Failed to create website');
  }

  return website;
}

export async function createConversion(data: Omit<Conversion, 'id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // First verify website ownership
  const { data: website, error: websiteError } = await supabase
    .from('websites')
    .select('id')
    .eq('id', data.website_id)
    .eq('user_id', user.id)
    .single();

  if (websiteError || !website) {
    console.error('Website verification error:', websiteError);
    throw new Error('You do not have permission to create conversions for this website');
  }

  // Create conversion
  const { data: conversion, error: conversionError } = await supabase
    .from('conversions')
    .insert(data)
    .select()
    .single();

  if (conversionError) {
    console.error('Create conversion error:', conversionError);
    throw new Error('Failed to create conversion');
  }

  return conversion;
}