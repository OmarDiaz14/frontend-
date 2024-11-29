import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Paper } from "@mui/material";
import { Search, X } from "lucide-react";
import { iInventario } from "../../services/var.inven";

interface SearchFilterProps {
  onFilterChange: (filteredData: iInventario[]) => void;
  iInventario: iInventario[];
}

interface SearchValues {
  serie: string;
  estatus: string;
  expediente: string;
}

const SearchFilteriInventario: React.FC<SearchFilterProps> = ({
  onFilterChange,
  iInventario,
}) => {
  const [searchValues, setSearchValues] = useState<SearchValues>({
    serie: "",
    estatus: "",
    expediente: "",
  });

  const searchFields = [
    { key: "expediente", label: "Número de Expediente" },
    { key: "estatus", label: "Estatus" },
    { key: "serie", label: "Serie" },
  ];

  useEffect(() => {
    const filteredData = iInventario.filter((item) => {
      return Object.entries(searchValues).every(([key, value]) => {
        if (!value) return true;
        const itemValue =
          item[key as keyof iInventario]?.toString().toLowerCase() ?? "";
        return itemValue.includes(value.toLowerCase());
      });
    });

    onFilterChange(filteredData);
  }, [searchValues, iInventario, onFilterChange]);

  const handleClear = (field: keyof SearchValues): void => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSearchChange = (
    field: keyof SearchValues,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Paper elevation={0} className="p-4 mb-4 bg-gray-50 border-b">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchFields.map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            value={searchValues[field.key as keyof SearchValues]}
            onChange={(e) =>
              handleSearchChange(
                field.key as keyof SearchValues,
                e as React.ChangeEvent<HTMLInputElement>
              )
            }
            className="w-full"
            size="small"
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e2e8f0",
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="h-4 w-4 text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: searchValues[field.key as keyof SearchValues] && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleClear(field.key as keyof SearchValues)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}
      </div>
    </Paper>
  );
};

export default SearchFilteriInventario;
