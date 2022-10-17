import React, {useContext, useState, useEffect} from "react";
import { initialState, types } from "../reducers/journalReducer";
import { AppContext } from "../App";
import {StoicIdentity} from "ic-stoic-identity";
import "./LoadScreen.scss";
import { getIntObserverFunc, visibilityFunctionDefault } from "./animations/IntersectionObserverFunctions";


const LoadScreen = () => {

    const { dispatch, journalState } = useContext(AppContext);
    const [showTop, setShowTop] = useState(true);
    const [showBottom, setShowBottom] = useState(false);
    let seconds = 0;
    const toggleAnimations = () => {
        setShowBottom(!showBottom);
        setShowTop(!showTop);
        seconds++;
    }
    setTimeout(toggleAnimations, 1000);

    useEffect(() => {
        const containers = document.querySelectorAll(".contentContainer.animatedLeft");
        containers.forEach( (container, index) => {
            let props_ = {
                className: "animatedLeft",
                containerIndex: index,
                visibilityFunction: visibilityFunctionDefault
            };
            const observer = new IntersectionObserver(getIntObserverFunc(props_), {threshold: .1});
            observer.observe(container);
        });
    }, [journalState])

    return(
        <div className="container">
            <div className="loadContentContainer">
                <div className={`loadContentDiv contentContainer ${showTop ? 'animatedLeft' : ''}`}>
                    <img src="Loading.gif" alt="Loading Screen" />
                </div>
                <div className={`loadContentDiv contentContainer ${showBottom ? 'animatedLeft' : ''}`}>
                    <img src="Loading.gif" alt="Loading Screen" />
                </div>
                <div className={`loginButtonDiv contentContainer ${(seconds > 9) ? 'animatedLeft' : ''}`}>
                    <button className={'loginButton'} onClick={async () => {
                        dispatch({
                            actionType: types.SET_ENTIRE_REDUX_STATE,
                            payload: initialState
                        });
                        StoicIdentity.load().then(async identity => {
                            if (identity !== false) StoicIdentity.disconnect();
                            dispatch({
                                actionType: types.SET_STOIC_IDENTITY,
                                payload: undefined
                            });
                        });
                        await journalState.authClient.logout();
                        dispatch({
                            actionType: types.SET_IS_LOGGING_IN,
                            payload: true
                        })
                    }}> Log Out </button>  
                </div>
            </div> 
        </div>
    );

};

export default LoadScreen;