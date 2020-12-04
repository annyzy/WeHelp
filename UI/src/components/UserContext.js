import { createContext } from 'react';

/**
* A global context that is used to pass user, chatList, taskList in App.js to all observer pages.
* As soon as this UserContext in App.js changes, all children use this UserContext will rerender.
* @type {Context}
*/
export const UserContext = createContext(); 