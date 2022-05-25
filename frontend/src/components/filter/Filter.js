import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const categories = [
  "📚 Academics",
  "🎨 Fine Arts",
  "🎭 Performing Arts",
  "🎉 Socials",
  "⚽️ Sports",
  "🧘‍♀️ Wellness",
];

const locations = [
  "🧑‍💻 Virtual",
  "🏔 On the Hill",
  "🏫 On Campus",
  "🍪 Westwood",
  "🚗 LA",
];

const dates = [
  "1️⃣ Monday",
  "2️⃣ Tuesday",
  "3️⃣ Wednesday",
  "4️⃣ Thursday",
  "5️⃣ Friday",
  "6️⃣ Saturday",
  "7️⃣ Sunday",
];

const times = ["🌆 Morning", "🏙 Afternoon", "🌃 Night"];

function getFilterOptions(filterOpt, eventFilter, theme) { 
  return {
    fontWeight:
      eventFilter.indexOf(filterOpt) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip() {
  const theme = useTheme();
  const [categoryFilter, setCategoryFilter] = React.useState([]);
  const [locationFilter, setLocationFilter] = React.useState([]);
  const [dateFilter, setDateFilter] = React.useState([]);
  const [timeFilter, setTimeFilter] = React.useState([]);

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;

    setCategoryFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleLocationChange = (event) => {
    const {
      target: { value },
    } = event;

    setLocationFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleDateChange = (event) => {
    const {
      target: { value },
    } = event;

    setDateFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleTimeChange = (event) => {
    const {
      target: { value },
    } = event;

    setTimeFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200 }} size="small">
        <InputLabel id="demo-multiple-chip-label" sx={{ bgcolor:"white" }}>Category</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={categoryFilter}
          onChange={handleCategoryChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {categories.map((filterOpt) => (
            <MenuItem
              key={filterOpt}
              value={filterOpt}
              style={getFilterOptions(filterOpt, categoryFilter, theme)}
            >
              {filterOpt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 200 }} size="small">
        <InputLabel id="demo-multiple-chip-label" sx={{ bgcolor:"white" }}>Location</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={locationFilter}
          onChange={handleLocationChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {locations.map((filterOpt) => (
            <MenuItem
              key={filterOpt}
              value={filterOpt}
              style={getFilterOptions(filterOpt, locationFilter, theme)}
            >
              {filterOpt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 200 }} size="small">
        <InputLabel id="demo-multiple-chip-label" sx={{ bgcolor:"white" }}>Date</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={dateFilter}
          onChange={handleDateChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {dates.map((filterOpt) => (
            <MenuItem
              key={filterOpt}
              value={filterOpt}
              style={getFilterOptions(filterOpt, dateFilter, theme)}
            >
              {filterOpt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 200 }} size="small">
        <InputLabel id="demo-multiple-chip-label" sx={{ bgcolor:"white" }}>Time</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={timeFilter}
          onChange={handleTimeChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {times.map((filterOpt) => (
            <MenuItem
              key={filterOpt}
              value={filterOpt}
              style={getFilterOptions(filterOpt, timeFilter, theme)}
            >
              {filterOpt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}