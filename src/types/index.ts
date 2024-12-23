export interface Lead {
  id: string;
  website_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  last_ip: string | null;
  custom_data: Record<string, any>;
  created_at: string;
  events_count: number;
  conversions_count: number;
}