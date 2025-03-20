export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          address: string
          amount: number
          area: string
          commission: number | null
          created_at: string
          date: string
          discount_applied: boolean | null
          discount_value: number | null
          final_amount: number | null
          id: string
          payment_method: string | null
          pincode: string
          service_id: string
          status: string
          technician_id: string | null
          time: string
          user_id: string | null
        }
        Insert: {
          address: string
          amount: number
          area: string
          commission?: number | null
          created_at?: string
          date: string
          discount_applied?: boolean | null
          discount_value?: number | null
          final_amount?: number | null
          id?: string
          payment_method?: string | null
          pincode: string
          service_id: string
          status: string
          technician_id?: string | null
          time: string
          user_id?: string | null
        }
        Update: {
          address?: string
          amount?: number
          area?: string
          commission?: number | null
          created_at?: string
          date?: string
          discount_applied?: boolean | null
          discount_value?: number | null
          final_amount?: number | null
          id?: string
          payment_method?: string | null
          pincode?: string
          service_id?: string
          status?: string
          technician_id?: string | null
          time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          booking_id: string
          id: string
          payment_method: string | null
          status: string
          technician_id: string
          timestamp: string
        }
        Insert: {
          amount: number
          booking_id: string
          id?: string
          payment_method?: string | null
          status: string
          technician_id: string
          timestamp?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          id?: string
          payment_method?: string | null
          status?: string
          technician_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          name: string
          service_id: string | null
          start_date: string
          status: string
          valid_for: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          name: string
          service_id?: string | null
          start_date: string
          status: string
          valid_for: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          name?: string
          service_id?: string | null
          start_date?: string
          status?: string
          valid_for?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          id: string
          payment_method: string
          status: string
          timestamp: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          id?: string
          payment_method: string
          status: string
          timestamp?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          id?: string
          payment_method?: string
          status?: string
          timestamp?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          id: string
          image: string | null
          location: string | null
          name: string
          rating: number
          review: string
          technician_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          id?: string
          image?: string | null
          location?: string | null
          name: string
          rating: number
          review: string
          technician_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          image?: string | null
          location?: string | null
          name?: string
          rating?: number
          review?: string
          technician_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string
          created_at: string
          description: string
          duration: number
          id: string
          name: string
          rate: number
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          duration: number
          id?: string
          name: string
          rate: number
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          duration?: number
          id?: string
          name?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          address: string | null
          area: string
          availability: boolean | null
          category_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          pincode: string
          rating: number | null
        }
        Insert: {
          address?: string | null
          area: string
          availability?: boolean | null
          category_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          pincode: string
          rating?: number | null
        }
        Update: {
          address?: string | null
          area?: string
          availability?: boolean | null
          category_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          pincode?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      is_partner: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_professional: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
