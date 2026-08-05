import type { HabitCategory, HabitColor, HabitFrequency, HabitIcon } from "@/features/habits/types";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          timezone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: HabitCategory;
          color: HabitColor;
          icon: HabitIcon;
          frequency: HabitFrequency;
          start_date: string;
          archived: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          category: HabitCategory;
          color: HabitColor;
          icon: HabitIcon;
          frequency: HabitFrequency;
          start_date: string;
          archived?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          category?: HabitCategory;
          color?: HabitColor;
          icon?: HabitIcon;
          frequency?: HabitFrequency;
          start_date?: string;
          archived?: boolean;
          display_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      checkins: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          date: string;
          completed_at: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          habit_id: string;
          date: string;
          completed_at: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          completed_at?: string;
          note?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
