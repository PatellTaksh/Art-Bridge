export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      auctions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          nft_id: string
          reserve_price: number | null
          seller_user_id: string | null
          seller_wallet: string | null
          start_price: number
          starts_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          nft_id: string
          reserve_price?: number | null
          seller_user_id?: string | null
          seller_wallet?: string | null
          start_price: number
          starts_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          nft_id?: string
          reserve_price?: number | null
          seller_user_id?: string | null
          seller_wallet?: string | null
          start_price?: number
          starts_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auctions_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          amount: number
          auction_id: string
          bidder_user_id: string | null
          bidder_wallet: string | null
          created_at: string
          id: string
          tx_hash: string | null
        }
        Insert: {
          amount: number
          auction_id: string
          bidder_user_id?: string | null
          bidder_wallet?: string | null
          created_at?: string
          id?: string
          tx_hash?: string | null
        }
        Update: {
          amount?: number
          auction_id?: string
          bidder_user_id?: string | null
          bidder_wallet?: string | null
          created_at?: string
          id?: string
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      chain_events: {
        Row: {
          auction_id: string | null
          created_at: string
          data: Json
          event_type: string
          height: number | null
          id: string
          nft_id: string | null
          tx_hash: string | null
        }
        Insert: {
          auction_id?: string | null
          created_at?: string
          data: Json
          event_type: string
          height?: number | null
          id?: string
          nft_id?: string | null
          tx_hash?: string | null
        }
        Update: {
          auction_id?: string | null
          created_at?: string
          data?: Json
          event_type?: string
          height?: number | null
          id?: string
          nft_id?: string | null
          tx_hash?: string | null
        }
        Relationships: []
      }
      fractionalizations: {
        Row: {
          created_at: string
          cw20_address: string
          id: string
          nft_id: string
          total_shares: number
        }
        Insert: {
          created_at?: string
          cw20_address: string
          id?: string
          nft_id: string
          total_shares: number
        }
        Update: {
          created_at?: string
          cw20_address?: string
          id?: string
          nft_id?: string
          total_shares?: number
        }
        Relationships: [
          {
            foreignKeyName: "fractionalizations_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          created_at: string
          id: string
          nft_id: string
          price_amount: number
          price_denom: string
          seller_user_id: string | null
          seller_wallet: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nft_id: string
          price_amount: number
          price_denom: string
          seller_user_id?: string | null
          seller_wallet?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nft_id?: string
          price_amount?: number
          price_denom?: string
          seller_user_id?: string | null
          seller_wallet?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          chain_id: string
          created_at: string
          cw721_address: string
          description: string | null
          id: string
          image_url: string | null
          metadata_uri: string | null
          name: string | null
          owner_user_id: string | null
          owner_wallet: string | null
          status: string
          token_id: string
          updated_at: string
        }
        Insert: {
          chain_id: string
          created_at?: string
          cw721_address: string
          description?: string | null
          id?: string
          image_url?: string | null
          metadata_uri?: string | null
          name?: string | null
          owner_user_id?: string | null
          owner_wallet?: string | null
          status?: string
          token_id: string
          updated_at?: string
        }
        Update: {
          chain_id?: string
          created_at?: string
          cw721_address?: string
          description?: string | null
          id?: string
          image_url?: string | null
          metadata_uri?: string | null
          name?: string | null
          owner_user_id?: string | null
          owner_wallet?: string | null
          status?: string
          token_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      valuation_cache: {
        Row: {
          cached_at: string
          key_hash: string
          ttl_seconds: number
          valuation: Json
        }
        Insert: {
          cached_at?: string
          key_hash: string
          ttl_seconds?: number
          valuation: Json
        }
        Update: {
          cached_at?: string
          key_hash?: string
          ttl_seconds?: number
          valuation?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
