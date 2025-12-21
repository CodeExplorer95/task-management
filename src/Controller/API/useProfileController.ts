import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { ToastMessage } from '../../Adapter/Alert/ToastMessage';
import { useProfileModel } from '../../Model/ProfileModel/useProfileModel';
import { ErrorMethods } from '../../Utils/ErrorHandler';

export const useProfileController = (
  profileModel: ReturnType<typeof useProfileModel>,
) => {
  const signupwithEmailandpassword = async (): Promise<boolean> => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(
        auth,
        profileModel.emailInfo.email,
        profileModel.passwordInfo.password,
      );
      ToastMessage.TOAST_SHORT_TOP('Account created successfully');
      return true;
    } catch (fbError: any) {
      if (fbError?.code === 'auth/email-already-in-use') {
        ToastMessage.TOAST_SHORT_TOP('That email address is already in use!');
        return false;
      }
      if (fbError?.code === 'auth/invalid-email') {
        ToastMessage.TOAST_SHORT_TOP('That email address is invalid!');
        return false;
      }
      console.error('Firebase signup error', fbError);
      ErrorMethods.errorHandler(
        fbError?.response?.status,
        fbError?.response?.data?.message?.[0] || fbError?.message,
      );
      return false;
    }
  };

  const signinWithEmailandpassword = async (): Promise<boolean> => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(
        auth,
        profileModel.emailInfo.email,
        profileModel.passwordInfo.password,
      );
      ToastMessage.TOAST_SHORT_TOP('Signed in successfully');
      return true;
    } catch (fbError: any) {
      if (fbError?.code === 'auth/user-not-found') {
        ToastMessage.TOAST_SHORT_TOP('No user found with this email');
        return false;
      }
      if (fbError?.code === 'auth/wrong-password') {
        ToastMessage.TOAST_SHORT_TOP('Incorrect password');
        return false;
      }
      console.error('Firebase signin error', fbError);
      ErrorMethods.errorHandler(
        fbError?.response?.status,
        fbError?.response?.data?.message?.[0] || fbError?.message,
      );
      return false;
    }
  };

  const signout = async (): Promise<void> => {
    try {
      const auth = getAuth();
      await signOut(auth);
      ToastMessage.TOAST_SHORT_TOP('Signed out');
    } catch (e) {
      console.error('Signout error', e);
    }
  };

  const splashFunctionality = async (): Promise<boolean> => {
    try {
      const auth = getAuth();
      if (auth.currentUser) return true;
      return false;
    } catch (e) {
      console.error('splashFunctionality error', e);
      return false;
    }
  };

  return {
    signupwithEmailandpassword,
    signinWithEmailandpassword,
    signout,
    splashFunctionality,
  };
};
