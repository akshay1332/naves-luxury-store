import { Database } from "@/integrations/supabase/types";

export type CustomDesign = Database["public"]["Tables"]["custom_designs"]["Row"];

export interface CustomDesignWithOrder extends CustomDesign {
  order: {
    invoice_number: string;
    status: string;
  };
}

export interface CustomDesignUpload {
  file: File;
  instructions?: string;
}

export interface CustomDesignLink {
  url: string;
  instructions?: string;
}

export type CustomDesignInput = CustomDesignUpload | CustomDesignLink;

export interface CustomDesignFormData {
  designType: "upload" | "link";
  file?: File;
  url?: string;
  instructions?: string;
} 