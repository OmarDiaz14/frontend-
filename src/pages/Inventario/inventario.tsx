import Logo from "../../assets/Tlaxcala.png";
import { TableInventory } from "../Inventario/TableInventario";

export function Inventory() {
  return (
    <body>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      ></link>
      <img className="Logo_imgRU" src={Logo} alt="" width={"25%"} />
      <div className="layoutAuthentication">
        <div className="layoutAuthentication_content">
          <main>
            <div className="container-fluid">
              <div className="row ">
                <div className="col-lg-4"></div>
              </div>
              <TableInventory></TableInventory>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}
