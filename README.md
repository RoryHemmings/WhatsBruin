# [WhatsBruin](http://whatsbruin.tech/)
_A personalized event calendar for UCLA students._

Sports games, club meetings, activities on the Hill—currently, there is no truly centralized place where students can view all upcoming events that match their interests. But _WhatsBruin_ solves this problem by providing students with a way to explore, filter, and save events they're interested in, allowing them to truly focus on enjoying the college experience!

Try it out at: http://whatsbruin.tech/

![Landing](https://user-images.githubusercontent.com/65837446/171300348-761f0adc-0731-49af-9085-f803275fd99f.gif)

## Table of Contents
- [Setup](https://github.com/RoryHemmings/WhatsBruin/#setup)
- [Features](https://github.com/RoryHemmings/WhatsBruin/#features)
- [Authors](https://github.com/RoryHemmings/WhatsBruin/#authors)

## Setup

### Frontend Setup
To run our frontend application locally, complete the following steps in your preferred IDE (we used Visual Studio Code!):
1. Clone the repository and change into the appropriate directory:
```
git clone https://github.com/RoryHemmings/WhatsBruin.git
cd frontend
```
2. Install node dependencies:
```
npm install --force
```
3. Run the app!
```
npm start
```

### Backend Setup
To run our backend application locally, complete the following steps in you preferred IDE (we used Visual Studio Code!):
1. Ignore this step if you've already followed [Frontend Setup](https://github.com/RoryHemmings/WhatsBruin/#frontend-setup), otherwise first clone this repository:
```
git clone https://github.com/RoryHemmings/WhatsBruin.git
```
2. Change into the appropriate directory:
```
cd backend
```
3. Install node dependencies: 
```
npm install
```
4. Run the app!
```
npm start
```

## Features
1. Users can search for a specific event or filter from a list of events.
![Search](https://user-images.githubusercontent.com/65837446/171301369-b11bd074-1c01-4e7e-9d17-c14085b2a331.gif)
2. Users can save public events onto their personalized private calendars. <img width="600" alt="Add Event" src="https://user-images.githubusercontent.com/65837446/171301782-e21427b2-356e-446b-a875-4698d8966c47.png">
3. Users can explore events created by a specific organization. <img width="600" alt="Organizer Search" src="https://user-images.githubusercontent.com/65837446/171302272-cf684ff8-b182-4633-8596-ec95b62ac6bc.png">
4. Users can receive weekly emails with event recommendations based on their interests. <img width="600" alt="Email" src="https://user-images.githubusercontent.com/65837446/171309728-1970c148-951d-4c16-9c5e-1190078351c1.png">


## Authors
Created by Amanda Wang, Caolinn Hukill, Juliet Zhang, Rory Hemmings, and Salma Alandary for UCLA's CS 35L course taught by Professor Paul Eggert in Spring 2022.

## Package Credits
Material UI, Pigeon Maps, FullCalendar, ReactJS Popup, JWT decode, React, Dotenv, Bcrypt, Passport, UUID, Nodemailer, Express, NodeJS, PostgreSQL
