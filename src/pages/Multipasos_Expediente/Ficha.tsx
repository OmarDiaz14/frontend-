import "../../styles/Styles.css";

export const Ficha = () => {
  return (
    <div className="Contenedor_Ficha">
      <div className="Ficha">
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        ></link>

        <header className="Header_Logo">
          <div className="H_Title">
            <h1 className="Header_Title">
              Ficha Técnica de Valoración Documental
            </h1>
          </div>
        </header>

        <div className="Contenedor_Formulario">
          <form>
            <label htmlFor="Expediente"> </label>
            <input type="text" placeholder="ID Expediente" />

            <label htmlFor="ID_Ficha"> ID_Ficha</label>
            <input type="text" placeholder="ID Ficha " />

            <label htmlFor="Area Resguardante"> Area Resguardante</label>
            <input
              type="text"
              placeholder=" Ingresa el Área Resguardante de tú Expediente "
            />

            <label htmlFor="Razon"> Razon</label>
            <input type="text" placeholder=" Ingresa la Razón del Expediente" />

            <label htmlFor="Areas_Intervienen"> Áreas que intervienen </label>
            <input
              type="text"
              placeholder=" Ingresa las Áreas que Intervienen"
            />

            <label htmlFor="Descripción_Ficha"> Descripción </label>
            <input
              type="text"
              placeholder=" Ingresa la Descripción del Expediente"
            />

            <label htmlFor="Soporte_Documental_Ficha">
              {" "}
              Soporte Documental{" "}
            </label>
            <input type="text" placeholder=" Ingresa el Soporte Documental" />

            <label htmlFor="ID_Seccion_Ficha"> ID Sección </label>
            <select className="Seccion_Ficha">
              <option selected>Seccion</option>
              <option>1C. Marco Jurídico.</option>
              <option>2C. Asuntos Jurídicos.</option>
              <option>3C. Programación, organización y presupuestación.</option>
              <option>4C. Recursos Humanos</option>
              <option>5C. Recursos Financieros</option>
              <option>6C. Recursos Materiales</option>
              <option>7C. Servicios Generales</option>
              <option>8C. Tecnologías de la Información</option>
              <option>9C. Comunicación Social</option>
              <option>10C. Contraloria Municipal</option>
              <option>
                11C. Planeación, Información, Evaluación y Políticas
              </option>
              <option>12C. Transparencia</option>
              <option>13C. Administración de Archivos</option>
              <option>1S. Gobernación</option>
              <option>2S. Hacienda Municipal</option>
              <option>3S. Servicios Municipales</option>
              <option>4S. Desarrollo económico</option>
              <option>5S. Desarrollo Social (BIENESTAR)</option>
              <option>6S. Desarrollo Urbano y Medio Ambiente</option>
              <option>7S. Seguridad Pública </option>
              <option>8S. Desarrollo Integral de la Familia</option>
            </select>

            <label htmlFor="ID_Serie_Ficha"> ID Serie </label>
            <select className="Serie_Ficha">
              <option selected>Serie</option>
              <option>1C1. Disposiciones en materia normativa.</option>
              <option>
                1C2. Convenios y tratados nacionales e internacionales.
              </option>
              <option>1C3. Decretos.</option>
              <option>1C4. Reglamentos y lineamientos.</option>
              <option>1C5. Planes, programas y proyectos.</option>
              <option>1C6. Acuerdos Generales.</option>
              <option>1C7. Circulares, oficios, memorandums.</option>
              <option>1C8. Instrumentos Juridicos Concensuales.</option>
              <option>1C9. Relaciones jurídicas.</option>
            </select>

            <label htmlFor="ID_Serie_Ficha"> ID Subserie </label>
            <select className="SubSerie_Ficha">
              <option> Subserie (...)</option>
            </select>
          </form>
        </div>
      </div>
    </div>
  );
};
