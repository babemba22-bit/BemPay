"use client";

import type { Creator, Payment, PaymentLink, Session } from "./types";

const CREATOR_KEY = "bempay_creator";
const LINKS_KEY = "bempay_links";
const PAYMENTS_KEY = "bempay_payments";
const SESSION_KEY = "bempay_session";

// --- LocalStorage Helpers ---
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    console.warn(`Tried to set localStorage key "${key}" on the server.`);
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
}

// --- Seeding ---
function seedData() {
  if (typeof window === "undefined") return;

  if (localStorage.getItem(CREATOR_KEY) === null) {
    const mockCreator: Creator = {
      creator_id: "creator_1",
      display_name: "Amadou",
      country: "ML",
      default_currency: "XOF",
      created_at: new Date().toISOString(),
    };
    saveCreator(mockCreator);
  }

  if (localStorage.getItem(LINKS_KEY) === null) {
    const mockPaymentLinks: PaymentLink[] = [
      {
        link_id: "link_1",
        creator_id: "creator_1",
        title: 'T-shirt "Mali Dev"',
        description: "High-quality cotton t-shirt for developers in Mali.",
        amount_xof: 15000,
        slug: "T-SHIRT",
        status: "ACTIVE",
        created_at: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        disabled_at: null,
      },
      {
        link_id: "link_2",
        creator_id: "creator_1",
        title: "Consulting Session (1hr)",
        description: "A one-hour consulting session on web development.",
        amount_xof: 75000,
        slug: "CONSULT",
        status: "PAID",
        created_at: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        disabled_at: null,
      },
    ];
    setItem(LINKS_KEY, mockPaymentLinks);
  }

  if (localStorage.getItem(PAYMENTS_KEY) === null) {
    setItem(PAYMENTS_KEY, []);
  }

  if (localStorage.getItem(SESSION_KEY) === null) {
    setItem(SESSION_KEY, { isAuthed: false, authed_at: null });
  }
}

// Ensure data is seeded on first load
if (typeof window !== "undefined") {
  seedData();
}

// --- API ---

// Creator
export function getCreator(): Creator | null {
  return getItem<Creator | null>(CREATOR_KEY, null);
}

export function saveCreator(creator: Creator) {
  setItem(CREATOR_KEY, creator);
}

// Links
export function listLinks(): PaymentLink[] {
  return getItem<PaymentLink[]>(LINKS_KEY, []);
}

export function getLinkBySlug(slug: string): PaymentLink | undefined {
  const links = listLinks();
  return links.find((link) => link.slug.toLowerCase() === slug.toLowerCase());
}

export function createLink(data: Omit<PaymentLink, "link_id" | "creator_id" | "created_at" | "disabled_at" | "status">): PaymentLink {
  const creator = getCreator();
  if (!creator) throw new Error("No creator found. Cannot create link.");
  
  // For a real app, a backend would guarantee uniqueness. For this demo, random is sufficient.
  const slug = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newLink: PaymentLink = {
    ...data,
    slug,
    link_id: `link_${Math.random().toString(36).substr(2, 9)}`,
    creator_id: creator.creator_id,
    created_at: new Date().toISOString(),
    status: "ACTIVE",
    disabled_at: null,
  };

  const links = listLinks();
  setItem(LINKS_KEY, [newLink, ...links]);
  return newLink;
}

export function updateLinkStatus(link_id: string, status: PaymentLink['status']): PaymentLink | undefined {
    const links = listLinks();
    let targetLink: PaymentLink | undefined;
    const updatedLinks = links.map(link => {
        if (link.link_id === link_id) {
            targetLink = { ...link, status, disabled_at: status === 'DISABLED' ? new Date().toISOString() : link.disabled_at };
            return targetLink;
        }
        return link;
    });
    setItem(LINKS_KEY, updatedLinks);
    return targetLink;
}


// Payments
export function listPayments(): Payment[] {
  return getItem<Payment[]>(PAYMENTS_KEY, []);
}

export function createPayment(data: Omit<Payment, "payment_id" | "provider" | "provider_tx_id" | "status" | "paid_at" | "raw_payload">): Payment {
  const newPayment: Payment = {
    ...data,
    payment_id: `payment_${Math.random().toString(36).substr(2, 9)}`,
    provider: "SIMULATED",
    provider_tx_id: `sim_${Math.random().toString(36).substr(2, 9)}`,
    status: "INITIATED",
    paid_at: null,
    raw_payload: {},
  };
  const payments = listPayments();
  setItem(PAYMENTS_KEY, [...payments, newPayment]);
  return newPayment;
}

export function markPaymentSuccess(payment_id: string, link_id: string): { payment?: Payment; link?: PaymentLink } {
  const payments = listPayments();
  let updatedPayment: Payment | undefined;
  const updatedPayments = payments.map((p) => {
    if (p.payment_id === payment_id) {
      updatedPayment = {
        ...p,
        status: "SUCCESS",
        paid_at: new Date().toISOString(),
      };
      return updatedPayment;
    }
    return p;
  });
  setItem(PAYMENTS_KEY, updatedPayments);

  const updatedLink = updateLinkStatus(link_id, "PAID");

  return { payment: updatedPayment, link: updatedLink };
}

export function markPaymentFailure(payment_id: string): Payment | undefined {
    const payments = listPayments();
    let failedPayment: Payment | undefined;
    const updatedPayments = payments.map((p) => {
        if (p.payment_id === payment_id) {
          failedPayment = { ...p, status: "FAILED" };
          return failedPayment;
        }
        return p;
    });
    setItem(PAYMENTS_KEY, updatedPayments);
    return failedPayment;
}

// Session
export function getSession(): Session {
  return getItem<Session>(SESSION_KEY, { isAuthed: false, authed_at: null });
}

export function login(): Session {
  const session = { isAuthed: true, authed_at: new Date().toISOString() };
  setItem(SESSION_KEY, session);
  return session;
}

export function logout() {
  const session = { isAuthed: false, authed_at: null };
  setItem(SESSION_KEY, session);
}
