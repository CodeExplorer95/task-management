import {AxiosInstance} from '../../Adapter/Axios/AxiosInstance';

class ApiControllers {
  //Private Methods
  private getAPiController = async <T>(endpoint: string): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      const response = await AxiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  private postApiController = async <T>(
    endpoint: string,
    body: object,
    queryParams?: object, // Add optional query parameters
    signal?: AbortSignal, // Add signal parameter for AbortController
  ): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      console.log('PAYLOAD: ' + JSON.stringify(body));
      console.log('QUERY PARAMS: ' + JSON.stringify(queryParams?.params));

      const response = await AxiosInstance.post<T>(endpoint, body, {
        params: queryParams?.params,
        signal, // Axios automatically appends query params to the URL
      });
      console.log(response, 'test response');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  private patchAPiController = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      console.log('PAYLOAD: ' + JSON.stringify(body));
      const response = await AxiosInstance.patch<T>(endpoint, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  private putApiController = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      console.log('PAYLOAD: ' + JSON.stringify(body));
      const response = await AxiosInstance.put<T>(endpoint, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  private deleteApiController = async <T>(endpoint: string): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      const response = await AxiosInstance.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  //Public Methods...
  public getAPiCall = async <T>(endpoint: string): Promise<T> => {
    try {
      const data = await this.getAPiController<T>(endpoint);
      return data;
    } catch (error) {
      throw error;
    }
  };
  public postApiCall = async <T>(
    endpoint: string,
    body: object,
    queryParams?: object, // Add optional query parameters
  ): Promise<T> => {
    try {
      const controller = new AbortController();
      // Get the abortController's signal
      console.log(body, 'favourite place data');
      const signal = controller.signal;
      const data = await this.postApiController<T>(endpoint, body, {
        params: queryParams, // Axios automatically appends query params to the URL
        signal,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
  public patchAPiCall = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      const data = await this.patchAPiController<T>(endpoint, body);
      return data;
    } catch (error) {
      throw error;
    }
  };
  public putAPiCall = async <T>(endpoint: string, body: object): Promise<T> => {
    try {
      const data = await this.putApiController<T>(endpoint, body);
      return data;
    } catch (error) {
      throw error;
    }
  };
  public deleteAPiCall = async <T>(endpoint: string): Promise<T> => {
    try {
      const data = await this.deleteApiController<T>(endpoint);
      return data;
    } catch (error) {
      throw error;
    }
  };
}

class MultiPartApiControllers extends ApiControllers {
  //Private Methods..
  private POST_MULTIPART_API_CONTROLLER = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      console.log('PAYLOAD: ' + JSON.stringify(body));
      const response = await AxiosInstance.post<T>(endpoint, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  private PATCH_MULTIPART_API_CONTROLLER = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      console.log('PAYLOAD: ' + JSON.stringify(body));
      const response = await AxiosInstance.patch<T>(endpoint, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  private PUT_MULTIPART_API_CONTROLLER = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      console.log('URL: ' + endpoint);
      console.log('PAYLOAD: ' + JSON.stringify(body));
      const response = await AxiosInstance.put<T>(endpoint, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Public Methods...
  public post_Multipart_ApiCall = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      const data = await this.POST_MULTIPART_API_CONTROLLER<T>(endpoint, body);
      return data;
    } catch (error) {
      throw error;
    }
  };
  public patch_Multipart_ApiCall = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      const data = await this.PATCH_MULTIPART_API_CONTROLLER<T>(endpoint, body);
      return data;
    } catch (error) {
      throw error;
    }
  };
  public put_Multipart_ApiCall = async <T>(
    endpoint: string,
    body: object,
  ): Promise<T> => {
    try {
      const data = await this.PUT_MULTIPART_API_CONTROLLER<T>(endpoint, body);
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const API_SERVICES = new MultiPartApiControllers();
