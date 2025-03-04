import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Paper } from "@mui/material";
import { Search, X } from "lucide-react";
import { ficha } from "../../services/var.ficha";

interface SearchFilterProps {
  onFilterChange: (filteredData: ficha[]) => void;
  ficha: ficha[];
}

interface SearchValues {
  id_ficha: string;
  descripcion: string;
  soporte_docu: string;
}

const SearchFilterIPortada: React.FC<SearchFilterProps> = ({
  onFilterChange,
  ficha,
}) => {
  const [searchValues, setSearchValues] = useState<SearchValues>({
    id_ficha: "",
    descripcion: "",
    soporte_docu: "",
  });

  const searchFields = [
    { key: "id_ficha", label: "Número de Ficha" },
    { key: "descripcion", label: "Descripcion" },
    { key: "soporte_docu", label: "Soporte Documental" },
  ];

  useEffect(() => {
    const filteredData = ficha.filter((item) => {
      return Object.entries(searchValues).every(([key, value]) => {
        if (!value) return true;
        const itemValue =
          item[key as keyof ficha]?.toString().toLowerCase() ?? "";
        return itemValue.includes(value.toLowerCase());
      });
    });

    onFilterChange(filteredData);
  }, [searchValues, ficha, onFilterChange]);

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
