export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    name: string;
                    birth_date: string | null;
                    gender: string | null;
                    nationality: string | null;
                    email: string | null;
                    phone: string | null;
                    military_service: string | null;
                    profile_image_url: string | null;
                    bio: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
            };
            // Add other table types as needed
        };
    };
};
