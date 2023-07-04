import React, { useState } from "react"

// Required so UserProvider doesn't throw a type error
export interface IProviderProps {
    children?: any;
}

// It took forever to find the way to get this to work without any type errors.
// Solution comes from https://stackoverflow.com/a/62932958
export type IUserState = {
    token?: string | null;
};

type IUserContext = [IUserState, React.Dispatch<React.SetStateAction<IUserState>>];

const UserContext = React.createContext<IUserContext>([{}, () => null])

const UserProvider = (props: IProviderProps) => {
    const [state, setState] = useState<IUserState>({ token: null});

    return (
        <UserContext.Provider value={[ state, setState ]}>
            {props.children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider }