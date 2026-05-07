export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          contact_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          type: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          type: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_global: {
        Row: {
          created_at: string | null
          event: string
          id: number
          meta: Json | null
          place_id: string | null
          zip_code: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: number
          meta?: Json | null
          place_id?: string | null
          zip_code?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: number
          meta?: Json | null
          place_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      asana_connections: {
        Row: {
          access_token: string
          asana_user_email: string | null
          asana_user_id: string | null
          asana_user_name: string | null
          created_at: string | null
          default_project_id: string | null
          default_workspace_id: string | null
          expires_at: string
          id: string
          refresh_token: string
          token_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          asana_user_email?: string | null
          asana_user_id?: string | null
          asana_user_name?: string | null
          created_at?: string | null
          default_project_id?: string | null
          default_workspace_id?: string | null
          expires_at: string
          id?: string
          refresh_token: string
          token_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          asana_user_email?: string | null
          asana_user_id?: string | null
          asana_user_name?: string | null
          created_at?: string | null
          default_project_id?: string | null
          default_workspace_id?: string | null
          expires_at?: string
          id?: string
          refresh_token?: string
          token_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          availability_info: Json | null
          backdrop: string | null
          category: string | null
          content_type: string | null
          created_at: string | null
          critic_score: number | null
          cuisines: string[] | null
          description: string | null
          external_id: string | null
          genre_names: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          lat: number
          lng: number
          metadata: Json | null
          name: string
          original_title: string | null
          photo_ref: string | null
          place_id: string
          plot_overview: string | null
          poster: string | null
          price_level: number | null
          price_range: string | null
          rating: number | null
          runtime_minutes: number | null
          session_id: string | null
          sources: Json | null
          tags: string[] | null
          title: string | null
          trailer: string | null
          url: string | null
          us_rating: string | null
          user_rating: number | null
          user_ratings_total: number | null
          year: number | null
        }
        Insert: {
          availability_info?: Json | null
          backdrop?: string | null
          category?: string | null
          content_type?: string | null
          created_at?: string | null
          critic_score?: number | null
          cuisines?: string[] | null
          description?: string | null
          external_id?: string | null
          genre_names?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          lat: number
          lng: number
          metadata?: Json | null
          name: string
          original_title?: string | null
          photo_ref?: string | null
          place_id: string
          plot_overview?: string | null
          poster?: string | null
          price_level?: number | null
          price_range?: string | null
          rating?: number | null
          runtime_minutes?: number | null
          session_id?: string | null
          sources?: Json | null
          tags?: string[] | null
          title?: string | null
          trailer?: string | null
          url?: string | null
          us_rating?: string | null
          user_rating?: number | null
          user_ratings_total?: number | null
          year?: number | null
        }
        Update: {
          availability_info?: Json | null
          backdrop?: string | null
          category?: string | null
          content_type?: string | null
          created_at?: string | null
          critic_score?: number | null
          cuisines?: string[] | null
          description?: string | null
          external_id?: string | null
          genre_names?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          lat?: number
          lng?: number
          metadata?: Json | null
          name?: string
          original_title?: string | null
          photo_ref?: string | null
          place_id?: string
          plot_overview?: string | null
          poster?: string | null
          price_level?: number | null
          price_range?: string | null
          rating?: number | null
          runtime_minutes?: number | null
          session_id?: string | null
          sources?: Json | null
          tags?: string[] | null
          title?: string | null
          trailer?: string | null
          url?: string | null
          us_rating?: string | null
          user_rating?: number | null
          user_ratings_total?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          project_id: string | null
          receipt_url: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          receipt_url?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ignored_items: {
        Row: {
          id: string
          ignored_at: string | null
          item_data: Json
          item_type: string
        }
        Insert: {
          id?: string
          ignored_at?: string | null
          item_data: Json
          item_type: string
        }
        Update: {
          id?: string
          ignored_at?: string | null
          item_data?: Json
          item_type?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          contact_id: string | null
          created_at: string | null
          date_sent: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          notes: string | null
          paid_date: string | null
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          contact_id?: string | null
          created_at?: string | null
          date_sent?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          notes?: string | null
          paid_date?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          contact_id?: string | null
          created_at?: string | null
          date_sent?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          notes?: string | null
          paid_date?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_archive: {
        Row: {
          created_at: string | null
          id: string
          parsed_data: Json | null
          raw_text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parsed_data?: Json | null
          raw_text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parsed_data?: Json | null
          raw_text?: string
        }
        Relationships: []
      }
      openai_usage: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          input_cost_usd: number
          input_tokens: number
          metadata: Json | null
          model: string
          output_cost_usd: number
          output_tokens: number
          purpose: string
          response_time_ms: number | null
          session_id: string | null
          success: boolean | null
          total_cost_usd: number
          total_tokens: number
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_cost_usd: number
          input_tokens: number
          metadata?: Json | null
          model: string
          output_cost_usd: number
          output_tokens: number
          purpose: string
          response_time_ms?: number | null
          session_id?: string | null
          success?: boolean | null
          total_cost_usd: number
          total_tokens: number
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_cost_usd?: number
          input_tokens?: number
          metadata?: Json | null
          model?: string
          output_cost_usd?: number
          output_tokens?: number
          purpose?: string
          response_time_ms?: number | null
          session_id?: string | null
          success?: boolean | null
          total_cost_usd?: number
          total_tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "openai_usage_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openai_usage_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          contact_id: string | null
          created_at: string | null
          expected_close: string | null
          id: string
          next_action: string | null
          notes: string | null
          probability: number | null
          project_id: string | null
          stage: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          expected_close?: string | null
          id?: string
          next_action?: string | null
          notes?: string | null
          probability?: number | null
          project_id?: string | null
          stage?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          expected_close?: string | null
          id?: string
          next_action?: string | null
          notes?: string | null
          probability?: number | null
          project_id?: string | null
          stage?: string | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          client_fingerprint: string | null
          display_name: string | null
          id: string
          is_host: boolean | null
          joined_at: string | null
          session_id: string | null
          submitted_at: string | null
        }
        Insert: {
          client_fingerprint?: string | null
          display_name?: string | null
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          session_id?: string | null
          submitted_at?: string | null
        }
        Update: {
          client_fingerprint?: string | null
          display_name?: string | null
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          session_id?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      precedentes: {
        Row: {
          created_at: string | null
          id: string
          notas: string | null
          relacion: string | null
          sentencia_citada_id: string
          sentencia_id: string | null
          tema: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notas?: string | null
          relacion?: string | null
          sentencia_citada_id: string
          sentencia_id?: string | null
          tema?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notas?: string | null
          relacion?: string | null
          sentencia_citada_id?: string
          sentencia_id?: string | null
          tema?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "precedentes_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: false
            referencedRelation: "sentencias"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "precedentes_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: false
            referencedRelation: "v_cambios_precedente"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "precedentes_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: false
            referencedRelation: "v_sentencias_completas"
            referencedColumns: ["sentencia_id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          category: string | null
          client: string | null
          created_at: string | null
          deadline: string | null
          drive_folder_url: string | null
          hours_estimate: number | null
          id: string
          is_favorite: boolean | null
          links: Json | null
          milestones: Json | null
          name: string
          next_milestone: string | null
          notes: string | null
          phase: string | null
          scope: string | null
          sort_order: number | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          category?: string | null
          client?: string | null
          created_at?: string | null
          deadline?: string | null
          drive_folder_url?: string | null
          hours_estimate?: number | null
          id?: string
          is_favorite?: boolean | null
          links?: Json | null
          milestones?: Json | null
          name: string
          next_milestone?: string | null
          notes?: string | null
          phase?: string | null
          scope?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          category?: string | null
          client?: string | null
          created_at?: string | null
          deadline?: string | null
          drive_folder_url?: string | null
          hours_estimate?: number | null
          id?: string
          is_favorite?: boolean | null
          links?: Json | null
          milestones?: Json | null
          name?: string
          next_milestone?: string | null
          notes?: string | null
          phase?: string | null
          scope?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recurring_templates: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          next_occurrence: string
          notes: string | null
          project_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          next_occurrence: string
          notes?: string | null
          project_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_occurrence?: string
          notes?: string | null
          project_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_templates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_insights: {
        Row: {
          created_at: string | null
          id: string
          journal_id: string | null
          status: string
          text: string
          track: string
          year_idx: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          journal_id?: string | null
          status: string
          text: string
          track: string
          year_idx: number
        }
        Update: {
          created_at?: string | null
          id?: string
          journal_id?: string | null
          status?: string
          text?: string
          track?: string
          year_idx?: number
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_insights_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "roadmap_journal"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_journal: {
        Row: {
          created_at: string | null
          id: string
          text: string
          track: string
          year_idx: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          text: string
          track: string
          year_idx: number
        }
        Update: {
          created_at?: string | null
          id?: string
          text?: string
          track?: string
          year_idx?: number
        }
        Relationships: []
      }
      roadmap_milestones: {
        Row: {
          created_at: string | null
          highlight: boolean | null
          id: string
          sort_order: number | null
          text: string
          timing: string
          track: string
          year_idx: number
        }
        Insert: {
          created_at?: string | null
          highlight?: boolean | null
          id?: string
          sort_order?: number | null
          text: string
          timing: string
          track: string
          year_idx: number
        }
        Update: {
          created_at?: string | null
          highlight?: boolean | null
          id?: string
          sort_order?: number | null
          text?: string
          timing?: string
          track?: string
          year_idx?: number
        }
        Relationships: []
      }
      rps_games: {
        Row: {
          created_at: string | null
          id: string
          round_number: number | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          winner_participant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          round_number?: number | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          winner_participant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          round_number?: number | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          winner_participant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rps_games_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rps_games_winner_participant_id_fkey"
            columns: ["winner_participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      rps_moves: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          move: string
          participant_id: string | null
          round_number: number
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          move: string
          participant_id?: string | null
          round_number: number
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          move?: string
          participant_id?: string | null
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "rps_moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "rps_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rps_moves_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      sentencia_embeddings: {
        Row: {
          embedding: string | null
          generated_at: string | null
          sentencia_id: string
          tema_primario: string | null
          temas_secundarios: string[] | null
        }
        Insert: {
          embedding?: string | null
          generated_at?: string | null
          sentencia_id: string
          tema_primario?: string | null
          temas_secundarios?: string[] | null
        }
        Update: {
          embedding?: string | null
          generated_at?: string | null
          sentencia_id?: string
          tema_primario?: string | null
          temas_secundarios?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sentencia_embeddings_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "sentencias"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "sentencia_embeddings_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "v_cambios_precedente"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "sentencia_embeddings_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "v_sentencias_completas"
            referencedColumns: ["sentencia_id"]
          },
        ]
      }
      sentencia_resumenes: {
        Row: {
          cambio_precedente: boolean | null
          decision: string | null
          derechos: string[] | null
          generated_at: string | null
          hechos: string | null
          model_version: string | null
          normas_demandadas: string[] | null
          nota_cambio: string | null
          precedente_citado: string[] | null
          problema_juridico: string | null
          ratio_decidendi: string | null
          regla_decision: string | null
          salvamentos_resumen: string | null
          sentencia_id: string
          temas: string[] | null
        }
        Insert: {
          cambio_precedente?: boolean | null
          decision?: string | null
          derechos?: string[] | null
          generated_at?: string | null
          hechos?: string | null
          model_version?: string | null
          normas_demandadas?: string[] | null
          nota_cambio?: string | null
          precedente_citado?: string[] | null
          problema_juridico?: string | null
          ratio_decidendi?: string | null
          regla_decision?: string | null
          salvamentos_resumen?: string | null
          sentencia_id: string
          temas?: string[] | null
        }
        Update: {
          cambio_precedente?: boolean | null
          decision?: string | null
          derechos?: string[] | null
          generated_at?: string | null
          hechos?: string | null
          model_version?: string | null
          normas_demandadas?: string[] | null
          nota_cambio?: string | null
          precedente_citado?: string[] | null
          problema_juridico?: string | null
          ratio_decidendi?: string | null
          regla_decision?: string | null
          salvamentos_resumen?: string | null
          sentencia_id?: string
          temas?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sentencia_resumenes_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "sentencias"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "sentencia_resumenes_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "v_cambios_precedente"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "sentencia_resumenes_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "v_sentencias_completas"
            referencedColumns: ["sentencia_id"]
          },
        ]
      }
      sentencia_textos: {
        Row: {
          char_count: number | null
          scraped_at: string | null
          sentencia_id: string
          temas_header: string[] | null
          texto_completo: string | null
          texto_html: string | null
          textsearch: unknown
          word_count: number | null
        }
        Insert: {
          char_count?: number | null
          scraped_at?: string | null
          sentencia_id: string
          temas_header?: string[] | null
          texto_completo?: string | null
          texto_html?: string | null
          textsearch?: unknown
          word_count?: number | null
        }
        Update: {
          char_count?: number | null
          scraped_at?: string | null
          sentencia_id?: string
          temas_header?: string[] | null
          texto_completo?: string | null
          texto_html?: string | null
          textsearch?: unknown
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sentencia_textos_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "sentencias"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "sentencia_textos_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "v_cambios_precedente"
            referencedColumns: ["sentencia_id"]
          },
          {
            foreignKeyName: "sentencia_textos_sentencia_id_fkey"
            columns: ["sentencia_id"]
            isOneToOne: true
            referencedRelation: "v_sentencias_completas"
            referencedColumns: ["sentencia_id"]
          },
        ]
      }
      sentencias: {
        Row: {
          aclaracion_voto: string | null
          anio: number
          created_at: string | null
          expediente_numero: string | null
          expediente_tipo: string | null
          fecha: string | null
          id: string
          magistrado_ponente: string | null
          numero: number
          proceso: string | null
          sala: string | null
          salvamento_voto: string | null
          sentencia_id: string
          tipo: string
          updated_at: string | null
          url_relatoria: string | null
        }
        Insert: {
          aclaracion_voto?: string | null
          anio: number
          created_at?: string | null
          expediente_numero?: string | null
          expediente_tipo?: string | null
          fecha?: string | null
          id?: string
          magistrado_ponente?: string | null
          numero: number
          proceso?: string | null
          sala?: string | null
          salvamento_voto?: string | null
          sentencia_id: string
          tipo: string
          updated_at?: string | null
          url_relatoria?: string | null
        }
        Update: {
          aclaracion_voto?: string | null
          anio?: number
          created_at?: string | null
          expediente_numero?: string | null
          expediente_tipo?: string | null
          fecha?: string | null
          id?: string
          magistrado_ponente?: string | null
          numero?: number
          proceso?: string | null
          sala?: string | null
          salvamento_voto?: string | null
          sentencia_id?: string
          tipo?: string
          updated_at?: string | null
          url_relatoria?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          ai_enhancement_enabled: boolean | null
          allow_multiple_matches: boolean | null
          category: string | null
          created_at: string | null
          host_notify_email: string | null
          host_notify_phone: string | null
          id: string
          invite_count_hint: number | null
          match_place_id: string | null
          match_reason: string | null
          match_requirement: string | null
          place_search_center: unknown
          preferences: Json | null
          radius_m: number | null
          require_names: boolean | null
          search_radius_miles: number | null
          status: string | null
          zip_code: string | null
        }
        Insert: {
          ai_enhancement_enabled?: boolean | null
          allow_multiple_matches?: boolean | null
          category?: string | null
          created_at?: string | null
          host_notify_email?: string | null
          host_notify_phone?: string | null
          id?: string
          invite_count_hint?: number | null
          match_place_id?: string | null
          match_reason?: string | null
          match_requirement?: string | null
          place_search_center?: unknown
          preferences?: Json | null
          radius_m?: number | null
          require_names?: boolean | null
          search_radius_miles?: number | null
          status?: string | null
          zip_code?: string | null
        }
        Update: {
          ai_enhancement_enabled?: boolean | null
          allow_multiple_matches?: boolean | null
          category?: string | null
          created_at?: string | null
          host_notify_email?: string | null
          host_notify_phone?: string | null
          id?: string
          invite_count_hint?: number | null
          match_place_id?: string | null
          match_reason?: string | null
          match_requirement?: string | null
          place_search_center?: unknown
          preferences?: Json | null
          radius_m?: number | null
          require_names?: boolean | null
          search_radius_miles?: number | null
          status?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      swipes: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          duration_ms: number | null
          id: string
          participant_id: string | null
          session_id: string | null
          vote: number
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          participant_id?: string | null
          session_id?: string | null
          vote: number
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          participant_id?: string | null
          session_id?: string | null
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "swipes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          energy: string | null
          id: string
          is_focus: boolean | null
          is_mine: boolean | null
          order: number | null
          pomodoro_count: number | null
          priority: string | null
          project_id: string | null
          status: string | null
          subtitle: string | null
          team: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          energy?: string | null
          id?: string
          is_focus?: boolean | null
          is_mine?: boolean | null
          order?: number | null
          pomodoro_count?: number | null
          priority?: string | null
          project_id?: string | null
          status?: string | null
          subtitle?: string | null
          team?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          energy?: string | null
          id?: string
          is_focus?: boolean | null
          is_mine?: boolean | null
          order?: number | null
          pomodoro_count?: number | null
          priority?: string | null
          project_id?: string | null
          status?: string | null
          subtitle?: string | null
          team?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          billable: boolean | null
          created_at: string | null
          date: string | null
          description: string | null
          hours: number
          id: string
          project_id: string | null
          task_id: string | null
        }
        Insert: {
          billable?: boolean | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          hours: number
          id?: string
          project_id?: string | null
          task_id?: string | null
        }
        Update: {
          billable?: boolean | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          hours?: number
          id?: string
          project_id?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          date: string | null
          description: string
          id: string
          invoice_id: string | null
          notes: string | null
          project_id: string | null
          recurring_template_id: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          project_id?: string | null
          recurring_template_id?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          project_id?: string | null
          recurring_template_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_template_id_fkey"
            columns: ["recurring_template_id"]
            isOneToOne: false
            referencedRelation: "recurring_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_signups: {
        Row: {
          created_at: string | null
          email: string
          id: string
          intent: string | null
          sentencia_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          intent?: string | null
          sentencia_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          intent?: string | null
          sentencia_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      v_cambios_precedente: {
        Row: {
          fecha: string | null
          magistrado_ponente: string | null
          nota_cambio: string | null
          precedente_citado: string[] | null
          sentencia_id: string | null
          temas: string[] | null
          tipo: string | null
        }
        Relationships: []
      }
      v_sentencias_completas: {
        Row: {
          aclaracion_voto: string | null
          anio: number | null
          cambio_precedente: boolean | null
          created_at: string | null
          decision: string | null
          derechos: string[] | null
          expediente_numero: string | null
          expediente_tipo: string | null
          fecha: string | null
          hechos: string | null
          id: string | null
          magistrado_ponente: string | null
          numero: number | null
          problema_juridico: string | null
          proceso: string | null
          ratio_decidendi: string | null
          sala: string | null
          salvamento_voto: string | null
          sentencia_id: string | null
          temas: string[] | null
          tipo: string | null
          updated_at: string | null
          url_relatoria: string | null
          word_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      find_session_matches: {
        Args: { p_session_id: string }
        Returns: {
          candidate_id: string
          name: string
          place_id: string
          total_participants: number
          yes_count: number
        }[]
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_session_status: {
        Args: { p_session_id: string }
        Returns: {
          invited_count: number
          joined_count: number
          remaining_candidates: number
          session_id: string
          status: string
          submitted_count: number
          total_candidates: number
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      search_by_tema: {
        Args: { max_results?: number; query_text: string }
        Returns: {
          decision: string
          hechos: string
          sentencia_id: string
          temas: string[]
        }[]
      }
      search_sentencias: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          fecha: string
          magistrado_ponente: string
          sentencia_id: string
          similarity: number
          temas: string[]
          tipo: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
