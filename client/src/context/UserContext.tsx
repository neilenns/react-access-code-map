import React, { useState } from "react"

type IUserState = {
    token?: string | null;
};

// Required so UserProvider doesn't throw a type error
export interface IProviderProps {
    children?: any;
    defaultState?: IUserState;
}

// It took forever to find the way to get this to work without any type errors.
// Solution comes from https://stackoverflow.com/a/62932958.
// Minor modifications based on https://stackoverflow.com/a/68851743/9206264 as well.

type IUserContext = [IUserState, React.Dispatch<React.SetStateAction<IUserState>>];

const UserContext = React.createContext<IUserContext>([{}, () => null])

const UserProvider = (props: IProviderProps) => {
    const state = useState<IUserState>({...props.defaultState});

    return (
        <UserContext.Provider value={state}>
            {props.children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider }