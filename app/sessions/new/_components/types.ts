import type { Producer } from "@/lib/reference";

export type ProducerChoice =
  | { kind: "existing"; producer: Producer }
  | { kind: "new"; name: string; finca: string };

export type CoffeeDraft = {
  localId: string;
  producer: ProducerChoice | null;
  varieties: string[];
  process: string | null;
  region_id: string | null;
  altitude: string;
  lot_code: string;
  notes: string;
};

export function emptyCoffee(): CoffeeDraft {
  return {
    localId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    producer: null,
    varieties: [],
    process: null,
    region_id: null,
    altitude: "",
    lot_code: "",
    notes: "",
  };
}

export function isCoffeeReady(c: CoffeeDraft): boolean {
  return c.producer !== null && c.varieties.length > 0;
}
