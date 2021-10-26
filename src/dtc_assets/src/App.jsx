import * as React from 'react';
import { dtc } from "../../declarations/dtc"

const App = () => {
    const [greeting, setGreeting] = React.useState("");
    const [pending, setPending] = React.useState(false);
    const inputRef = React.useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pending) return;
        setPending(true);
        const name = inputRef.current.value.toString();
        const userName = {userName: name};
        const entryKey = {entryKey: 1};
        const entry = { 
            date : name,
            text : name,
            location : name,    
        };

        // Interact with hello actor, calling the greet method
        const greeting = await dtc.updateJournal([], [entry]);
        console.log(greeting);
        let msg;
        if(greeting.ok === null){
            msg = "Journal Created";
        } else {
            msg = "Journal Already Exists"
        };
        setGreeting(msg);
        setPending(false);
        return false;
    }

    return (
        <main>
            <img src="logo.png" alt="DFINITY logo" />
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Enter your name: &nbsp;</label>
                <input id="name" alt="Name" type="text" ref={inputRef} />
                <button id="clickMeBtn" type="submit" disabled={pending}>Click Me!</button>
            </form>
            <section id="greeting">{greeting}</section>
        </main>
    )
}

export default App;