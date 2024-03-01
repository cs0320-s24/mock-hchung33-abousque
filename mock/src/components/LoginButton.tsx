import { Dispatch, SetStateAction } from "react";

/**
 * These are the Props for login functionality. 
 */
interface loginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

/**
 * This is the export function for Login, which checks if the user is logged in
 * and adjusts the login/logout functionality according to the value. 
 * @param props Props included for Login
 * @returns returns the login / sign out in HTML
 */
export function LoginButton(props: loginProps) {
  const authenticate = () => {
    const newValue = !props.isLoggedIn;
    props.setIsLoggedIn(newValue);
    return newValue;
  };

  if (props.isLoggedIn) {
    return (
      <button aria-label="Sign Out" onClick={authenticate}>
        Sign out
      </button>
    );
  } else {
    return (
      <button aria-label="Login" onClick={authenticate}>
        Login
      </button>
    );
  }
}
