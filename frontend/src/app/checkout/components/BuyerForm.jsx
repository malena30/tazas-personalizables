"use client";

import { useState } from "react";

export default function BuyerForm() {
  const [buyer, setBuyer] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    dni: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setBuyer({
      ...buyer,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Datos del comprador</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={buyer.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="surname"
          placeholder="Apellido"
          value={buyer.surname}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={buyer.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={buyer.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={buyer.dni}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={buyer.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={buyer.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Código Postal"
          value={buyer.postalCode}
          onChange={handleChange}
          className="border p-2 rounded"
        />

      </div>
    </div>
  );
}
