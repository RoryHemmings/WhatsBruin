import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function SubmitForm() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit."); // will need to change to connect to backend
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button
        variant="contained"
        sx={{ bgcolor: "#FCBA63", color: "#022A68", fontWeight: "bold" }}
      >
        submit
      </Button>
    </form>
  );
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const categories = [
    "📚 Academics",
    "🎨 Fine Arts",
    "🎭 Performing Arts",
    "🎉 Socials",
    "⚽️ Sports",
    "🧘‍♀️ Wellness",
  ];
  const [category, setCategory] = React.useState(0);
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const locations = [
    "🧑‍💻 Virtual",
    "🏫 On Campus",
    "🏔 On the Hill",
    "🍪 Westwood",
    "🚗 LA",
  ];
  const [location, setLocation] = React.useState(0);
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="➕ add event" {...a11yProps(0)} />
          <Tab label="✏️ edit event" {...a11yProps(1)} />
          <Tab label="🗑 delete event" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div>
          <TextField
            id="event-name"
            label="Event Name"
            variant="standard"
            sx={{ width: 600 }}
            required
          />
        </div>

        <div>
          <TextField
            id="date"
            label="Date"
            type="date"
            defaultValue="MM/DD/YYYY"
            sx={{ width: 220, marginTop: 5 }}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            id="start-time"
            label="Start Time"
            type="time"
            defaultValue="18:00"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150, marginTop: 5, marginLeft: 5, marginRight: 5 }}
            required
          />
          <TextField
            id="end-time"
            label="End Time"
            type="time"
            defaultValue="20:00"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150, marginTop: 5, marginBottom: 5 }}
            required
          />
        </div>

        <div>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 2, width: "32ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="select-category"
              select
              label="Category"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="select-location"
              select
              label="Location"
              value={location}
              onChange={handleLocationChange}
              required
            >
              {locations.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </div>
        <div>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
              marginTop: 3,
              marginBottom: 3,
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="additional-notes"
              label="Additional Notes"
              multiline
              rows={4}
              sx={{ width: 600 }}
            />
          </Box>
        </div>
        <SubmitForm />
      </TabPanel>

      {/* TODO: connect with backend */}
      <TabPanel value={value} index={1}>
        Select event to edit
      </TabPanel>

      {/* TODO: connect with backend */}
      <TabPanel value={value} index={2}>
        Select event to delete
      </TabPanel>
    </Box>
  );
}

const Manager = () => {
  return (
    <div className="App">
      <br />
      <h1>I would like to...</h1>
      <BasicTabs />
    </div>
  );
};

export default Manager;
