import CardsDashboard from "../../components/Cards/cardsDashboard";
import CardsInstrumentos from "../../components/Cards/cards_Instrumentos";
import Grafico from "../../components/Graficos/dgrafico";
import { Logo } from "../../components/Logo";
export function Home() {
  return (
    <div
      className="Principal"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        paddingTop: "7%",
      }}
    >
      <main
        id="Home"
        className="Home"
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <CardsDashboard />
        <CardsInstrumentos />
      </main>

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <Grafico
          width="84%"
          height={400}
          marginBottom={20}
          marginLeft="auto"
          marginRight="auto"
        />
      </div>
    </div>
  );
}
