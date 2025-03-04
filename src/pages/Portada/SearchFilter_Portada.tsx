import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Paper } from "@mui/material";
import { Search, X } from "lucide-react";
import { iPortada } from "../../services/var.portada";

interface SearchFilterProps {
  onFilterChange: (filteredData: iPortada[]) => void;
  iPortada: iPortada[];
}

interface SearchValues {
  num_expediente: string;
  fecha_apertura: string;
  fecha_cierre: string;
  destino_expe: string;
  asunto: string;
}

const SearchFilterIPortada: React.FC<SearchFilterProps> = ({
  onFilterChange,
  iPortada,
}) => {
  const [searchValues, setSearchValues] = useState<SearchValues>({
    num_expediente: "",
    fecha_apertura: "",
    fecha_cierre: "",
    destino_expe: "",
    asunto: "",
  });

  const searchFields = [
    { key: "num_expediente", label: "Número de Expediente" },
    { key: "fecha_apertura", label: "Fecha de Apertura" },
    { key: "fecha_cierre", label: "Fecha de Cierre" },
    { key: "destino_expe", label: "Destino del Expediente" },
    { key: "asunto", label: "Asunto" },
  ];

  useEffect(() => {
    const filteredData = iPortada.filter((item) => {
      return Object.entries(searchValues).every(([key, value]) => {
        if (!value) return true;
        const itemValue =
          item[key as keyof iPortada]?.toString().toLowerCase() ?? "";
        return itemValue.includes(value.toLowerCase());
      });
    });

    onFilterChange(filteredData);
  }, [searchValues, iPortada, onFilterChange]);

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

export default SearchFilterIPortada;
