import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

const cards = [
  {
    id: 1,
    title: "Plants",
    description: "Plants are essential for all life.",
    color: "#44ac44",
  },
  {
    id: 2,
    title: "Animals",
    description: "Animals are a part of nature.",
    color: "#F1872D",
  },
  {
    id: 3,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    color: "#FFCA1A",
  },
  {
    id: 3,
    title: "Humans",
    description: "Humans depend on plants and animals for survival.",
    color: "#446ca4",
  },
];

function CardsInstrumentos() {
  const [selectedCard, setSelectedCard] = React.useState(0);

  return (
    <Box
      sx={{
        width: "98%",
        margin: "20px",
        padding: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fill, minmax(150px, 1fr))",
            sm: "repeat(auto-fill, minmax(200px, 1fr))",
            md: "repeat(auto-fill, minmax(250px, 1fr))",
          },
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Card key={card.id}>
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                backgroundColor: card.color,
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "#f0f0f0", // Color pastel para el hover
                  },
                },
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Color pastel para el hover
                },
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default CardsInstrumentos;
