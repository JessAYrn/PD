import { NavBar } from "../../Components/navigation/NavBar";
import React, { useContext } from 'react';
import { AppContext } from "../../Context";

const Notes = (props) => {
  const { journalState, journalDispatch} = useContext(AppContext);
  return (
  <>
    <NavBar
      notificationIcon={true}
      unreadNotifications={journalState.notifications.length}
    />
    <div className='NotesPage_container'>
      coming soon
    </div>
  </>
  );
};

export default Notes;
