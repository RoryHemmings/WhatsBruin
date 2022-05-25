import React, { useState, useEffect } from "react";
import { getWithExpiry } from "../../Token";
import jwt_decode from "jwt-decode";
import Form from "./EditForm";
import { Navigate } from "react-router-dom";


export default function EditEvent() {
    const [events, setEvents] = useState([]);
    const userInfo = jwt_decode(getWithExpiry("user"));
    const [showEdit, setShowEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        let user = getWithExpiry("user");
        let userInfo = jwt_decode(user);
        if (userInfo === null) {
            return <Navigate to='/Signup' />
        }
        const getData = async () => {
            let res = await fetch("http://ec2-50-18-101-113.us-west-1.compute.amazonaws.com:3000/user?userid=" + userInfo.userid, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user,
                },
                method: "GET",
            })
            const status = res.status;
            res = await res.json();
            if (status < 400) {
                return res.events;
            }
            else {
                console.log("error");
            }
            setEvents(res.events);
        }
        getData().then(events => {
            setEvents(events)
        })
    }, [showEdit]);

    const handleClick = async (event) => {
        setSelected(event);
        console.log("selected, ", selected);
        setShowEdit(true);
    }
    // let showForm = () => {
    //     if (selected && showEdit) {
    //         editForm = <Form event={selected} />;
    //     }
    //     else {
    //         editForm =  <h2>nothing selected</h2>;
    //     }
    // }
    return (
        <div className="App">
            <div className="profile-events">
                <div className="cards">
                    {events?.map(event => {
                        return (
                            <div className="card" key={event.id}>
                                <div>
                                    <h2>{event.title}</h2>
                                    <h3>{event.date}</h3>
                                    <h3>{event.starttime} - {event.endtime}</h3>
                                    <h3>{event.description}</h3>
                                    <button onClick={() => handleClick(event)}> EDIT ME </button>
                                </div>
                            </div>
                        );
                    })}
                    {showEdit
                        ? (
                            <>
                                <Form
                                    event={selected}
                                    setShow={setShowEdit}
                                    setSelected={setSelected}
                                    show={showEdit}
                                />
                            </>
                        ) : (
                            <>
                            </>
                        )}
                </div>
            </div>
        </div>
    );
}
