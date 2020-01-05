
import { createBrowserHistory } from 'history';
import {authenticationService} from '../services/authenticationService';

export function DateConvert(datereceived) {
  return(
    new Intl.DateTimeFormat('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    }).format(datereceived)
  )
}

export const history = createBrowserHistory();

export function authHeader() {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.token) {
      return { Authorization: `Bearer ${currentUser.token}` };
  } else {
      return {};
  }
}