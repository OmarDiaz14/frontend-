import { TableSeccion } from "./TableSeccion";
import { TableSerie } from "./TableSerie";
import { TableSubserie } from "./TableSubSerie";
import "../../styles/Styles.css";

export function CuadroGeneral() {
  return (
    <div className="layoutAuthentication" style={{ paddingTop: "50px" }}>
      <div className="layoutAuthentication_content">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-9 col-md-10 col-sm-12">
                <div className="grid-container">
                  <div className="grid-item">
                    <h2 className="table-title">SECCIÓN</h2>
                    <TableSeccion />
                  </div>
                  <div className="grid-item">
                    <h2 className="table-title">SERIE</h2>
                    <TableSerie />
                  </div>
                  <div className="grid-item">
                    <h2 className="table-title">SUB-SERIE</h2>
                    <TableSubserie />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
