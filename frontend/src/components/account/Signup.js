//import * as React from 'react';
import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();


export default function SignUp() { //currently info just goes to console log on submit
  const initialState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  };
  const initialError = { //false = no error. true = error
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
  };
  const [allValues, setAllValues] = useState(initialState); //hook to track value of each field
  const [isFormInvalid, setIsFormInvalid] = useState(initialError); //hook bool to track error state
  const [rerender, setRerender] = useState(false); //hook to force re-render if necessary
 const changeHandler = e => {
    setAllValues({...allValues, [e.target.name]: e.target.value})
 };
 const validate = e => { //set of if-else statements to validate.
    let isValid = true;
    if(allValues.firstName === '') {
      isFormInvalid.firstName = true;
      isValid = false;
    }
    else{
      isFormInvalid.firstName = false;
    }
    if(allValues.lastName === '') {
      isFormInvalid.lastName = true;
      isValid = false;
    }
    else{
      isFormInvalid.lastName = false;
    }
    if(allValues.username === '') {
      isFormInvalid.username = true;
      isValid = false;
    }
    else{
      isFormInvalid.username = false;
    }
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
  const handleSubmit = (event) => { //currently just logs to console if valid,
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(allValues.firstName);
    if(validate(event.currentTarget)){
    console.log({ //temporary. gonna send to backend instead
      email: data.get('email'),
      password: data.get('password'),
      username: data.get('username'),
      firstname: data.get('firstName'),
      lastname: data.get('lastName'),
    });
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
          <Avatar sx={{ m: 1, bgcolor: '#db6f21' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={allValues.firstName ?? ""} //FIXING THIS
                  onChange={changeHandler}
                  error={isFormInvalid.firstName}
                  helperText={isFormInvalid.firstName? "Empty!" : " "} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={allValues.lastName ?? ""} //FIXING THIS
                  onChange={changeHandler}
                  error={isFormInvalid.lastName}
                  helperText={isFormInvalid.lastName? "Empty!" : " "} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={allValues.username ?? ""} //FIXING THIS
                  onChange={changeHandler}
                  error={isFormInvalid.username}
                  helperText={isFormInvalid.username? "Empty!" : " "} 
                />
              </Grid>
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/Login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}