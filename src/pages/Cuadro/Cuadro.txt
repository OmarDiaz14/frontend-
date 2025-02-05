import Logo from "../../assets/Tlaxcala.png";
import { Boton } from "../../components/Botones/Botones";
import { useState } from "react";
import { seccion_post } from "../../services/cuadro.service";

export function Cuadro() {
  const [ID, setID] = useState("");
  const [Codigo, setCode] = useState("");
  const [Descripcion, setDescripcion] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const Seccion = {
      id_seccion: ID,
      codigo: Codigo,
      descripcion: Descripcion,
    };

    try {
      const result = await seccion_post(Seccion);
      console.log("Respuesta de la APi:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <body className="Body_Cuadro">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      ></link>

      {/*Imagen de tlaxcala*/}
      <header className="Header_Logo">
        <div className="brandLogo">
          <img src={Logo} alt="Logo" width={300} />
        </div>

        <div className="H_Title">
          <h1 className="Header_Title">
            Cuadro General de Clasificación Archivistica
          </h1>
        </div>
      </header>

      {/*Barra multipasos*/}
      <div className="multisteps-form ">
        <div className="row">
          <div className="col-12 col-lg-8 ml-auto mr-auto mb-4">
            <div className="multisteps-form_progress">
              <button
                className="multisteps-form_progress-btn js-active"
                type="button"
                title="User Info"
              >
                Seccion
              </button>
              <button
                className="multisteps-form_progress-btn"
                type="button"
                title="Address"
              >
                Serie
              </button>
              <button
                className="multisteps-form_progress-btn"
                type="button"
                title="Order Info"
              >
                Subserie
              </button>
              <button
                className="multisteps-form_progress-btn"
                type="button"
                title="Message"
              >
                Resumen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*Seccion*/}
      <div className="row">
        <div className="col-12 col-lg-18 m-auto">
          <form className="multisteps-form_form" onSubmit={handleSubmit}>
            <div
              className="multisteps-form_panel shadow p-4 rounded bg-white js-active"
              data-animation="scaleIm"
            >
              <h3 className="multisteps-form_title">Seccion</h3>

              <div className="multisteps-form_v">
                <div className="form-row mt-4">
                  <div className="col-12 col-sm-6">
                    <label>ID Seccion</label>
                    <input
                      className="multisteps-form_input form-control"
                      type="text"
                      placeholder="ID Seccion"
                      value={ID}
                      onChange={(e) => setID(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-sm-6 mt-4 mt-sm-0">
                    <label>Codigo</label>
                    <input
                      className="multisteps-form_input form-control"
                      type="text"
                      placeholder="Codigo"
                      value={Codigo}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-sm-6 mt-4 mt-sm-0">
                    <label>Descripcion</label>
                    <input
                      className="multisteps-form_input form-control"
                      type="text"
                      placeholder="Decripcion"
                      value={Descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  </div>

                  <div className="button-row d-flex mt-4">
                    <Boton>Enviar</Boton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/*Serie*/}
      <div
        className="multisteps-form_panel shadow p-4 rounded bg-white"
        data-animation="scaleIn"
      >
        <h3 className="multisteps-form_title">Serie</h3>

        <div className="multisteps-form_content">
          <div className="form-row" mt-4>
            {/*Seccion*/}

            <div className="col-6 col-sm-3 mt-4 mt-4 mt-sm-0">
              <label>Seccion</label>
              <select className="multisteps-form_select form-control">
                Seccion
                <option selected>Seccion</option>
                <option>1C. Marco Jurídico.</option>
                <option>2C. Asuntos Jurídicos.</option>
                <option>
                  3C. Programación, organización y presupuestación.
                </option>
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
            </div>

            {/*ID Serie*/}
            <div className="col">
              <label>ID Serie</label>
              <input
                className="multisteps-form_input form-control"
                type="Select-box"
                placeholder="ID Serie"
              />
            </div>
          </div>

          {/*Descripcion*/}
          <div className="form-row mt-4">
            <div className="col">
              <label>Descripcion</label>
              <input
                className="multisteps-form_input form-control"
                type="text"
                placeholder="Descripcion"
              />
            </div>
          </div>

          {/*Botones Anterior y Siguiente*/}
          <div className="button-row d-flex mt-4">
            <Boton>Anterior</Boton>
            <Boton>Siguiente</Boton>
          </div>
        </div>
      </div>

      {/*Subserie*/}
      <div
        className="multisteps-form_panel shadow p-4 rounded bg-white"
        data-animation="scaleIn"
      >
        <h3 className="multisteps-form_title">Subserie</h3>

        <div className="multisteps-form_content">
          <div className="row">
            <div className="col-12 col-sm-6">
              <label>Seccion</label>
              <select className="multisteps-form_select form-control">
                <option selected>Seccion</option>
                <option>1C. Marco Jurídico.</option>
                <option>2C. Asuntos Jurídicos.</option>
                <option>
                  3C. Programación, organización y presupuestación.
                </option>
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
            </div>

            <div className="col-12 col-sm-6">
              <label>Serie</label>
              <select className="multisteps-form_select form-control">
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
            </div>

            <div className="col-12 col-sm-6">
              <label>ID Serie</label>
              <input
                className="multisteps-form_input form-control"
                type="text"
                placeholder="ID Subserie"
              />
            </div>

            <div className="col-12 col-sm-6 mt-4 mt-sm-0">
              <label>Descripcion</label>
              <input
                className="multisteps-form_input form-control"
                type="text"
                placeholder="Descripcion"
              />
            </div>
          </div>

          <div className="row">
            <div className="button-row d-flex mt-4 col-12">
              <Boton>Anterior</Boton>
              <Boton>Siguiente</Boton>
            </div>
          </div>
        </div>
      </div>

      <div
        className="multisteps-form_panel shadow p-4 rounded bg-white"
        data-animation="scaleIn"
      >
        <h3 className="multisteps-form_title">Vista Previa</h3>
        <div className="multisteps-form_content">
          {/*Resumen de la informacion*/}
          <div className="container">
            <table>
              <tr>
                <th>ID seccion</th>
                <th>Descripcion</th>
                <th>Editar</th>
              </tr>

              <tr>
                <td>12C</td>
                <td className="description">Transparencia</td>
                <td className="edit-icon"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </body>
  );
}
