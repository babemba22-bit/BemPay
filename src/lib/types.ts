export type Creator = {
  creator_id: string;
  display_name: string;
  country: "ML";
  default_currency: "XOF";
  created_at: string;
};

export type PaymentLink = {
  link_id: string;
  creator_id: string;
  title: string;
  description: string;
  amount_xof: number;
  slug: string;
  status: "ACTIVE" | "PAID" | "DISABLED";
  created_at: string;
  disabled_at: string | null;
};

export type Payment = {
  payment_id: string;
  link_id: string;
  provider: "SIMULATED";
  provider_tx_id: string;
  payer_name: string;
  payer_email: string;
  status: "INITIATED" | "SUCCESS" | "FAILED";
  paid_at: string | null;
  raw_payload: object;
};

export type Session = {
  isAuthed: boolean;
  authed_at: string | null;
};
