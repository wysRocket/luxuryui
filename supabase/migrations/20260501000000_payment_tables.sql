-- Payment orders: tracks SafePay checkout sessions
-- user_id stores Firebase UIDs (text, not UUID)
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                text NOT NULL,
  invoice                text NOT NULL UNIQUE,
  provider_transaction_id text,
  amount_minor           integer NOT NULL,
  currency               text NOT NULL CHECK (currency IN ('EUR', 'GBP')),
  credits_to_add         integer NOT NULL,
  status                 text NOT NULL DEFAULT 'processing'
                           CHECK (status IN ('processing', 'completed', 'failed', 'manual_review')),
  description            text,
  customer_first_name    text,
  customer_last_name     text,
  customer_email         text,
  customer_phone         text,
  customer_country_code  text,
  customer_city          text,
  raw_create_response    text,
  raw_status_response    jsonb,
  provider_status_id     integer,
  provider_status_text   text,
  last_checked_at        timestamptz,
  completed_at           timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now()
);

-- Credit transactions: idempotency guard for applied credits
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          text NOT NULL,
  payment_order_id uuid REFERENCES public.payment_orders(id),
  description      text,
  amount           integer NOT NULL,
  type             text NOT NULL DEFAULT 'credit' CHECK (type IN ('credit', 'debit')),
  status           text NOT NULL DEFAULT 'Completed',
  currency_paid    text,
  currency         text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (payment_order_id)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS payment_orders_user_id_idx ON public.payment_orders (user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx ON public.credit_transactions (user_id);

-- Edge functions run as service_role (admin client) — grant full access
GRANT SELECT, INSERT, UPDATE ON public.payment_orders TO service_role;
GRANT SELECT, INSERT ON public.credit_transactions TO service_role;

-- Enable RLS (service_role bypasses it; anon/authenticated cannot access directly)
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
