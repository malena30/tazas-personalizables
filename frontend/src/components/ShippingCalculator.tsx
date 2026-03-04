"use client";

import { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { getApiUrl } from "@/lib/api";

type RateResult = {
  success: boolean;
  mode: "api" | "fallback";
  estandar: number;
  prioritario: number;
};

export default function ShippingCalculator() {
  const { shipping, setShipping } = useCheckout();
  const [postalCode, setPostalCode] = useState("");
  const [rates, setRates] = useState<RateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    const cp = postalCode.trim();
    if (!cp || cp.length < 4) {
      setError("Ingresá un código postal válido (mínimo 4 dígitos)");
      return;
    }
    setError("");
    setLoading(true);
    setRates(null);

    try {
      const response = await fetch(`${getApiUrl()}/api/shipping/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postal_code: cp, weight_kg: 0.5 }),
      });
      if (!response.ok) throw new Error("Error al consultar el costo de envío");
      const data: RateResult = await response.json();
      setRates(data);
    } catch {
      setError("No se pudo calcular el envío. Intentá más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (method: "estandar" | "prioritario", cost: number) => {
    setShipping({ method: `correo-${method}`, cost });
  };

  return (
    <div className="space-y-5">
      {/* Input de CP */}
      <div className="flex gap-3">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Ej: 1425"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
          className="flex-1 px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
        />
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calculando...
            </span>
          ) : "Calcular"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}

      {/* Resultados */}
      {rates && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {rates.mode === "fallback" && (
            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider">
              Precios estimados — se confirman al despachar
            </p>
          )}

          {/* Opción Estándar */}
          <button
            onClick={() => handleSelect("estandar", rates.estandar)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${shipping.method === "correo-estandar"
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] hover:border-[var(--accent)]/40 bg-[var(--background)]"
              }`}
          >
            <div className="text-left">
              <p className="font-bold text-[var(--foreground)] text-sm">Correo Argentino — Estándar</p>
              <p className="text-xs text-[var(--foreground)]/40 mt-0.5">Entrega en 5–10 días hábiles</p>
            </div>
            <span className="font-black text-[var(--accent)] text-lg ml-4">
              ${rates.estandar.toLocaleString("es-AR")}
            </span>
          </button>

          {/* Opción Prioritario */}
          <button
            onClick={() => handleSelect("prioritario", rates.prioritario)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${shipping.method === "correo-prioritario"
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] hover:border-[var(--accent)]/40 bg-[var(--background)]"
              }`}
          >
            <div className="text-left">
              <p className="font-bold text-[var(--foreground)] text-sm">Correo Argentino — Prioritario</p>
              <p className="text-xs text-[var(--foreground)]/40 mt-0.5">Entrega en 2–4 días hábiles</p>
            </div>
            <span className="font-black text-[var(--accent)] text-lg ml-4">
              ${rates.prioritario.toLocaleString("es-AR")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
