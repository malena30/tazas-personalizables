"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ShippingCalculator() {
  const [postalCode, setPostalCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const setShippingCost = useCartStore((state) => state.setShippingCost);

  const fetchShipping = async () => {
    if (postalCode.length < 4) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `https://apis.idear.gov.ar/codigos-postales?codigo_postal=${postalCode}`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        setResult({ error: "Código postal no encontrado." });
        setShippingCost(0);
        setLoading(false);
        return;
      }

      const { localidad, provincia } = data[0];

      const provinceCosts: Record<string, number> = {
        "Ciudad Autónoma de Buenos Aires": 0,
        "Buenos Aires": 300,
        "Córdoba": 600,
        "Santa Fe": 600,
        "Entre Ríos": 600,
        "Corrientes": 800,
        "Misiones": 800,
        "Chaco": 900,
        "Formosa": 900,
        "Salta": 900,
        "Jujuy": 900,
        "Santiago del Estero": 800,
        "Tucumán": 800,
        "La Rioja": 900,
        "Catamarca": 900,
        "San Juan": 700,
        "San Luis": 700,
        "Mendoza": 700,
        "Neuquén": 1100,
        "Río Negro": 1100,
        "Chubut": 1200,
        "Santa Cruz": 1500,
        "Tierra del Fuego": 1800,
      };

      const base = 1900;
      const extra = provinceCosts[provincia] || 1000;
      const shipping = base + extra;

      setResult({
        localidad,
        provincia,
        shipping,
      });

      // <<< GUARDA EL ENVÍO EN ZUSTAND
      setShippingCost(shipping);

    } catch (error) {
      setResult({ error: "Error consultando el servicio." });
      setShippingCost(0);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 mt-6 border rounded-xl bg-white shadow">
      <h3 className="text-xl font-semibold mb-3">Calcular costo de envío</h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Código postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />
        <button
          onClick={fetchShipping}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Calcular
        </button>
      </div>

      {loading && <p className="mt-3 text-gray-600">Calculando...</p>}

      {result?.error && (
        <p className="mt-3 text-red-600">{result.error}</p>
      )}

      {result && !result.error && (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg">
          <p><strong>Localidad:</strong> {result.localidad}</p>
          <p><strong>Provincia:</strong> {result.provincia}</p>
          <p className="text-xl font-bold mt-2">
            Envío: ${result.shipping}
          </p>
        </div>
      )}
    </div>
  );
}

