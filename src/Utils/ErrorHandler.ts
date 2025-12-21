import {ToastMessage} from '../Adapter/Alert/ToastMessage';

class ErrorMethod {
  private errorCodes: {
    BAD_REQUEST: number;
    // UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    INTERNAL_SERVER_ERROR: number;
    SERVICE_UNAVAILABLE: number;
    CANNOT_PROCESS: number;
  } = {
    BAD_REQUEST: 400,
    // UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    CANNOT_PROCESS: 422,
  };
  private supportErrorTexts: {
    BAD_REQUEST: string;
    // UNAUTHORIZED: string;
    FORBIDDEN: string;
    NOT_FOUND: string;
    INTERNAL_SERVER_ERROR: string;
    SERVICE_UNAVAILABLE: string;
    DEFAULT: string;
    CANNOT_PROCESS: string;
  } = {
    BAD_REQUEST: 'Please enter valid data.',
    // UNAUTHORIZED: 'Please authenticate.',
    FORBIDDEN: 'Please enter valid data.',
    NOT_FOUND: 'Endpoint is not found.',
    INTERNAL_SERVER_ERROR: 'Internal server error.',
    SERVICE_UNAVAILABLE: 'Service not available.',
    DEFAULT: 'Please check your connection.',
    CANNOT_PROCESS: 'Server can not process this request.',
  };
  errorHandler(errorCode: number, errorText: string) {
    console.log(errorCode, '++++++++++++++++++++', errorText);
    switch (errorCode) {
      case this.errorCodes.BAD_REQUEST:
        ToastMessage.TOAST_SHORT_BOTTOM(
          errorText || this.supportErrorTexts.BAD_REQUEST,
        );
        break;
      // case this.errorCodes.UNAUTHORIZED:
      //     ToastView.error(errorText || this.supportErrorTexts.UNAUTHORIZED);
      //     break;
      case this.errorCodes.FORBIDDEN:
        ToastMessage.TOAST_SHORT_BOTTOM(
          errorText || this.supportErrorTexts.FORBIDDEN,
        );
        break;
      case this.errorCodes.NOT_FOUND:
        ToastMessage.TOAST_SHORT_BOTTOM(
          errorText || this.supportErrorTexts.NOT_FOUND,
        );
        break;
      case this.errorCodes.INTERNAL_SERVER_ERROR:
        ToastMessage.TOAST_SHORT_BOTTOM(
          errorText || this.supportErrorTexts.INTERNAL_SERVER_ERROR,
        );
        break;
      case this.errorCodes.SERVICE_UNAVAILABLE:
        ToastMessage.TOAST_SHORT_BOTTOM(
          errorText || this.supportErrorTexts.SERVICE_UNAVAILABLE,
        );
        break;
      case this.errorCodes.CANNOT_PROCESS:
        ToastMessage.TOAST_SHORT_BOTTOM(
          errorText || this.supportErrorTexts.CANNOT_PROCESS,
        );
        break;
      default:
        // console.log(errorCode, 'default');
        // ToastView.error(errorText || this.supportErrorTexts.DEFAULT);
        break;
    }
  }
}

export const ErrorMethods = new ErrorMethod();
