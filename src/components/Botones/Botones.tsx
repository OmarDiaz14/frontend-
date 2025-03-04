import "../../styles/Styles.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Boton({ children, ...props }: Props) {
  return (
    <div className="Contenedor_Boton">
      <button className="Boton" {...props}>
        {" "}
        {children}{" "}
      </button>
    </div>
  );
}
