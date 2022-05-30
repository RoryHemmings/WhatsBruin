import React, { useState} from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import  { Navigate } from 'react-router-dom'
import { getWithExpiry, setWithExpiry } from "../../Token";


export default function Login() {
  const theme = createTheme();
  const initialState = {
    email: '',
    password: '',
  }
  const initialError = { //false = no error. true = error
    email: false,
    password: false,
  }
  const [allValues, setAllValues] = useState(initialState); //hook to track value of each field
  const [isFormInvalid, setIsFormInvalid] = useState(initialError); //hook bool to track error state
  const [rerender, setRerender] = useState(false); //hook to force re-render if necessary
  const user = getWithExpiry("user");
  if(user !== null){
    return <Navigate to='/Profile'  />
  }

  const changeHandler = e => {
    setAllValues({...allValues, [e.target.name]: e.target.value})
 };
 const validate = e => { //set of if-else statements to validate.
  let isValid = true;
  if(allValues.email === '') {
    isFormInvalid.email = true;
    isValid = false;
  }
  else{
    isFormInvalid.email = false;
  }
  if(allValues.password === '') {
    isFormInvalid.password = true;
    isValid = false;
  }
  else{
    isFormInvalid.password = false;
  }
  if (isValid === true){
    return true;
  }
  return false;
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(allValues.firstName);
    if(validate(event.currentTarget)){
    console.log({ //testing
      email: data.get('email'),
      password: data.get('password'),
    });
    let res = await fetch ("http://ec2-52-53-130-125.us-west-1.compute.amazonaws.com:3000/auth/login", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method:"POST",
      body: JSON.stringify({
        email: data.get('email'), 
        password: data.get('password'),
      })
    })
    const status = res.status;
    console.log(res);
    res = await res.json();
    if(status === 200){ //do correct things
      console.log("works");
      console.log(res);
      console.log(res.accessToken);
      setWithExpiry("user", res.accessToken, 86400000); //24 hours in milliseconds
      setRerender(!rerender);
      window.location.reload(false);
      <Navigate to='/Profile'  />
    }
    else {
      alert(res.message);
      console.log("error stuff");
    }
    setIsFormInvalid({...initialError});
    setAllValues({...initialState});
  }
    else {
      setRerender(!rerender);
    }
    event.currentTarget.reset();
    console.log(isFormInvalid);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={allValues.email ?? ""} //FIXING THIS
                  onChange={changeHandler}
                  error={isFormInvalid.email}
                  helperText={isFormInvalid.email? "Empty!" : " "} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={allValues.password ?? ""} //FIXING THIS
                  onChange={changeHandler}
                  error={isFormInvalid.password}
                  helperText={isFormInvalid.password? "Empty!" : " "} 
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}