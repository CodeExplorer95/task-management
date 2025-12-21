import {CommonActions, useNavigation} from '@react-navigation/native';
import {AxiosInstance} from '../../Adapter/Axios/AxiosInstance';
import {useProfileModel} from '../../Model/ProfileModel/useProfileModel';
import {Screens} from '../../Adapter/Navigation/screenTypes';
import {ErrorMethods} from '../../Utils/ErrorHandler';
import {useProfileController} from '../API/useProfileController';
import {tokensType} from '../../Model/ProfileModel/types';

export const useInterceptor = (): void => {
  const Navigator = useNavigation();
  const profileModel = useProfileModel();
  const profileController = useProfileController(profileModel);

  /*Request interceptor */

  AxiosInstance.interceptors.request.use(
    async config => {
      const storeToken: tokensType =
        await profileModel.getTokensByAsyncStorage();
      // colorLog.magenta('request interceptor............', storeToken);
      if (storeToken) {
        config.headers.Authorization = `Bearer ${storeToken.accessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  /*Response Interceptor */

  AxiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      const storeToken: tokensType =
        await profileModel.getTokensByAsyncStorage();
      // colorLog.blueBright('response interceptor error............', storeToken);
      const originalConfig = error.config;
      if (error.response.status === 403) {
        console.log('403');
        //logout
        profileModel.logout();
        //redirect to log in screen
        Navigator.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: Screens.SignIn}],
          }),
        );
        ErrorMethods.errorHandler(
          error.response.status,
          'Session timeout.Please login again.',
        );
      }
      if (
        error.response &&
        error.response.status === 401 &&
        !originalConfig._retry
      ) {
        console.log('401');
        originalConfig._retry = true;

        const tokens = await profileController.refreshToken(
          storeToken.refreshToken,
        );
        if (tokens === false) {
          console.log('error in refresh token..');
          Navigator.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: Screens.SignIn}],
            }),
          );
          ErrorMethods.errorHandler(
            error.response.status,
            'Session timeout.Please login again.',
          );
        } else if (tokens) {
          originalConfig.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        return AxiosInstance(originalConfig);
      }

      return Promise.reject(error);
    },
  );
};
