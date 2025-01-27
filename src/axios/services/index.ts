import axios from 'axios';

import { Props } from '../interfaces';

// instances for different micro services

export const commonServiceInstance = axios.create();

// - - - instance specific services - - -

export const commonService = (props: Props) => {
  const url = `${props?.url ?? ''}`;
  return commonServiceInstance({
    ...props,
    url,
  });
};

// - - - authServiceInstance interceptor request - - -
commonServiceInstance.interceptors.request.use(
  (request) => {
    request.baseURL = 'http://localhost:5000';

    // Set custom headers
    request.headers['Content-Type'] = 'application/json';

    // Retrieve the token from localStorage
    const token = localStorage.getItem('accesstoken');

    // Add the Authorization header if the token exists
    if (token) {
      request.headers.Authorization = token;
    }
    // Include credentials with requests
    request.withCredentials = true;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// - - -  authServiceInstance interceptor response - - -
commonServiceInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response.status) {
      case 401:
        // localStorage.clear();
        // document.location.href = '/';
        break;
      case 400:
        // toast.error(error.response.data.message);
        break;
      default:
        break;
      // toast.error('Something really went wrong, please try again');
    }
    return Promise.reject(error);
  }
);
