import { useEffect, useState } from "react";
import { inventario_get } from "../../services/inventario.services";

export function MiComponente() {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await inventario_get();
        setInventario(data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Inventario</h2>
    </div>
  );
}
