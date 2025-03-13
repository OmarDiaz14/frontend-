import Cards_IA from "../../components/Cards/Cards_IA";
import Button from "react-bootstrap/esm/Button";

export const Crear_Expediente = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-6xl flex flex-col items-center space-y-4">
        <div className="w-full">
          <Cards_IA />
        </div>

        {/* Botón */}
        <div className="w-full flex justify-center">
          <Button
            variant="primary"
            className="px-6 py-2 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            href="/Home"
          >
            Regresar
          </Button>
        </div>
      </div>
    </div>
  );
};
