import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { getWithExpiry } from "../../Token";
import Grid from "@mui/material/Grid";
import jwt_decode from "jwt-decode";

export default function EditForm(props) {
  const initialState = {
    eventName: props.event.title,
    date: props.event.date,
    startTime: props.event.starttime,
    endTime: props.event.endtime,
    selectCategory: props.event.tags,
    selectLocation: props.event.location,
    additionalNotes: props.event.description,
  };
  const initialError = {
    eventName: false,
    date: false,
    startTime: false,
    endTime: false,
    selectCategory: false,
    selectLocation: false,
    additionalNotes: false,
  };

  const [allValues, setAllValues] = useState(initialState);
  const [isFormInvalid, setIsFormInvalid] = useState(initialError);
  const userInfo = jwt_decode(getWithExpiry("user"));
  const changeHandler = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const validate = (e) => {
    let isValid = true;

    if (allValues.eventName === "") {
      isFormInvalid.eventName = true;
      isValid = false;
    } else {
      isFormInvalid.eventName = false;
    }

    if (allValues.date === "") {
      isFormInvalid.date = true;
      isValid = false;
    } else {
      isFormInvalid.email = false;
    }

    if (allValues.startTime === "") {
      isFormInvalid.startTime = true;
      isValid = false;
    } else {
      isFormInvalid.startTime = false;
    }

    if (allValues.endTime === "") {
      isFormInvalid.endTime = true;
      isValid = false;
    } else {
      isFormInvalid.endTime = false;
    }

    if (allValues.startTime > allValues.endTime) {
      isFormInvalid.startTime = true;
      isFormInvalid.endTime = true;
      isValid = false;
    }

    if (allValues.category === "") {
      isFormInvalid.category = true;
      isValid = false;
    } else {
      isFormInvalid.category = false;
    }

    if (allValues.location === "") {
      isFormInvalid.location = true;
      isValid = false;
    } else {
      isFormInvalid.location = false;
    }

    if (allValues.additionalNotes === "") {
      isFormInvalid.additionalNotes = true;
      isValid = false;
    } else {
      isFormInvalid.additionalNotes = false;
    }

    if (isValid === true) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const tagArray = []; // TODO: change if we decide to not use arrays

    if (validate(event.currentTarget)) {
      tagArray.push(data.get("selectCategory")); // TODO: change if we decide to not use arrays
      const dayNum = new Date(data.get("date")).getDay();
      const day = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ][dayNum];

      let res = await fetch(
        "http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/event/edit",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            eventid: props.event.id,
            title: data.get("eventName"),
            description: data.get("additionalNotes"),
            date: data.get("date"),
            weekday: day,
            starttime: data.get("startTime"),
            endtime: data.get("endTime"),
            location: data.get("selectLocation"),
            organizer: String(userInfo.userid),
            organizeruser: String(userInfo.username),
            tags: tagArray,
            picture: "no image", // TODO: remove if not doing pics
          }),
        }
      );

      const status = res.status;
      res = await res.json();

      // TODO: remove
      if (status === 201) {
        console.log("works");
        console.log(res);
      } else {
        alert(res.message);
        alert("error stuff");
      }

      setIsFormInvalid({ ...initialError });
      setAllValues({ ...initialState });
    }
    props.setShow(false);
    props.setSelected(null);
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

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <div>
        <TextField
          id="eventName"
          label="Event Name"
          name="eventName"
          variant="standard"
          sx={{ width: 600, marginTop: 1, marginBottom: 1 }}
          required
          value={allValues.eventName ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.eventName}
          helperText={isFormInvalid.eventName ? "Invalid!" : " "}
        />
      </div>

      <div>
        <TextField
          id="date"
          label="Date"
          name="date"
          type="date"
          sx={{ width: 220, marginTop: 4 }}
          InputLabelProps={{ shrink: true }}
          required
          value={allValues.date ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.date}
          helperText={isFormInvalid.date ? "Invalid!" : " "}
        />
        <TextField
          id="startTime"
          label="Start Time"
          name="startTime"
          type="time"
          defaultValue="18:00"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          sx={{ width: 150, marginTop: 4, marginLeft: 5, marginRight: 5 }}
          required
          value={allValues.startTime ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.startTime}
          helperText={isFormInvalid.startTime ? "Invalid!" : " "}
        />
        <TextField
          id="endTime"
          label="End Time"
          name="endTime"
          type="time"
          defaultValue="20:00"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          sx={{ width: 150, marginTop: 4, marginBottom: 2 }}
          required
          value={allValues.endTime ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.endTime}
          helperText={isFormInvalid.endTime ? "Invalid!" : " "}
        />
      </div>

      <div>
        <TextField
          id="selectCategory"
          select
          label="Category"
          name="selectCategory"
          required
          value={allValues.selectCategory ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.selectCategory}
          helperText={isFormInvalid.selectCategory ? "Invalid!" : " "}
          sx={{ m: 3, width: "28ch", marginBottom: 5 }}
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="selectLocation"
          select
          label="Location"
          name="selectLocation"
          required
          value={allValues.selectLocation ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.selectLocation}
          helperText={isFormInvalid.selectLocation ? "Invalid!" : " "}
          sx={{ m: 3, width: "28ch", marginBottom: 5 }}
        >
          {locations.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div
        sx={{
          "& .MuiTextField-root": { m: 1 },
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <TextField
          id="additionalNotes"
          label="Additional Notes"
          name="additionalNotes"
          required
          multiline
          rows={4}
          sx={{ width: 600 }}
          value={allValues.additionalNotes ?? ""}
          onChange={changeHandler}
          error={isFormInvalid.additionalNotes}
          helperText={isFormInvalid.additionalNotes ? "Invalid!" : " "}
        />
      </div>
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          type="submit"
          sx={{
            marginTop: 4,
            bgcolor: "#FCBA63",
            color: "#022A68",
            fontWeight: "bold",
          }}
        >
          submit
        </Button>
        <Button
          sx={{
            marginTop: 4,
            marginLeft: 2,
            bgcolor: "#dfdfdf",
            color: "#022A68",
            fontWeight: "bold",
          }}
          onClick={() => {
            props.setShow(false);
            props.setSelected(null);
          }}
        >
          cancel
        </Button>
      </Grid>
    </Box>
  );
}
