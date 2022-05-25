import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";
import DeleteEvent from "./DeleteEvent";

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

function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{ marginTop: 2 }}
        >
          <Tab label="➕ create event" {...a11yProps(0)} />
          <Tab label="✏️ edit event" {...a11yProps(1)} />
          <Tab label="🗑 delete event" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} component="form">
        <CreateEvent />
      </TabPanel>

      {/* TODO: connect with backend */}
      <TabPanel value={value} index={1}>
        <EditEvent/>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <DeleteEvent />
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
