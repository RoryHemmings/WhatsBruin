import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function CustomizedInputBase() {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 300, marginTop: 3 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for an event"
        inputProps={{ 'aria-label': 'Search for an event' }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
