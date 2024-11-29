import { Logo } from "../../components/Logo";
import { useState, useEffect } from "react";
//import { user } from "../../services/var.user.services";
import { user_profile } from "../../services/user.services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export function ListaUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const items = await user_profile();
      setUsers(items);
    };
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [{ field: "id", headerName: "" }];
  return (
    <div>
      <p>Hola mundo</p>
    </div>
  );
}
