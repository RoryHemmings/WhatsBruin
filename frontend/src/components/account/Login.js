import React, { useState, useContext } from "react";
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
import { userContext } from '../../context/UserContext';
import  { Navigate } from 'react-router-dom'


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
  const { user, setUser} = useContext(userContext);
  if(user !== "none"){
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(allValues.firstName);
    if(validate(event.currentTarget)){
    console.log({ //temporary. gonna send to backend instead
      email: data.get('email'),
      password: data.get('password'),
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