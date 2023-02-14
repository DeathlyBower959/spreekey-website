import { Fields } from './types';

import Axios from 'axios';
import { trelloConfig } from '../config';

export async function request<T>(
  url: `/${string}`,
  fields: Fields
): Promise<T> {
  try {
    let urlBuilder = new URL(`${trelloConfig.API}${url}`);
    urlBuilder.searchParams.append('fields', fields.join(','));

    const res = await Axios.get(urlBuilder.toString());
    return res.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      return error.request;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      return error;
    }
  }
}
