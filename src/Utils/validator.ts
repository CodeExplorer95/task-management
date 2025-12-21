import isEmail from 'validator/es/lib/isEmail';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
// import isMobilePhone from 'validator/es/lib/isMobilePhone';

class Validator {
  isEmpty(text: string): boolean {
    if (text === '') {
      return true;
    } else {
      return false;
    }
  }

  isEmptyforOtp(text: string[]): boolean {
    if (text) {
      return false;
    } else {
      return true;
    }
  }
  isEmail(email?: string) {
    if (email) {
      return isEmail(email);
    } else {
      return false;
    }
  }

  isStrongPassword(password?: string) {
    if (password) {
      return isStrongPassword(password);
    } else {
      return false;
    }
  }

  isMobileNumber(phone?: string) {
    if (phone) {
      const regx_Letter = /^\+?[1-9][0-9]{5,14}$/;
      const is_ph_number_validate: boolean = regx_Letter?.test(
        phone.toLocaleLowerCase().trim(),
      );
      return is_ph_number_validate;
    } else {
      return false;
    }
  }

  isOnlyLetter(text?: string) {
    if (text) {
      const regx_Letter = /^[A-Za-z]+$/;
      const is_letter_validate: boolean = regx_Letter?.test(
        text.toLocaleLowerCase().trim(),
      );
      return is_letter_validate;
    } else {
      return false;
    }
  }
  isOnlyNumber(text?: string) {
    if (text) {
      const regx_Letter = /^[0-9]+$/;
      const is_letter_validate: boolean = regx_Letter?.test(
        text.toLocaleLowerCase().trim(),
      );
      return is_letter_validate;
    } else {
      return false;
    }
  }
  isNumerWithAlphabet(text?: string) {
    if (text) {
      const regx_Letter = /^[a-zA-Z0-9]*$/;
      const is_letter_validate: boolean = regx_Letter?.test(
        text.toLocaleLowerCase().trim(),
      );
      return is_letter_validate;
    } else {
      return false;
    }
  }

  isOnlyLetterWithSpace(text?: string) {
    if (text) {
      // Updated regex to allow letters, spaces, and special characters
      // const regx_Letter_Special = /^[a-zA-Z\s!@#$%^&*(),.?":{}|<>]*$/;
      // const is_letter_validate: boolean = regx_Letter_Special?.test(
      //   text.toLocaleLowerCase().trim(),
      // );
      // return is_letter_validate;
      return text;
    } else {
      return false;
    }
  }

  isOnlyLetterandNumberWithSpace(text?: string) {
    if (text) {
      const regx_Letter = /^[a-zA-Z0-9\s]*$/;
      const is_letter_validate: boolean = regx_Letter?.test(
        text.toLocaleLowerCase().trim(),
      );
      return is_letter_validate;
    } else {
      return false;
    }
  }

  isOnlyNumberWithSpace(text?: string) {
    if (text) {
      const regx_Letter = /^[0-9\s]*$/;
      const is_letter_validate: boolean = regx_Letter?.test(
        text.toLocaleLowerCase().trim(),
      );
      return is_letter_validate;
    } else {
      return false;
    }
  }

  isPricewithComma(text?: string) {
    if (text) {
      // const regx_Letter = /^\d+(\.\d{1,2})?$/;
      const regx_Letter = /^\d+(\.|\,)?\d{0,2}$/;
      const is_letter_validate: boolean = regx_Letter?.test(
        text.toLocaleLowerCase().trim(),
      );
      return is_letter_validate;
    } else {
      return false;
    }
  }

  isWebsite(text?: string) {
    if (text) {
      const regx_Letter = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;
      const is_letter_validate: boolean = regx_Letter?.test(text);
      return is_letter_validate;
    } else {
      return false;
    }
  }

  checkOnlySpacesinText(text?: string) {
    if (text) {
      const regx_Letter = /^\s*$/;
      const is_letter_validate: boolean = regx_Letter?.test(text);
      return is_letter_validate;
    } else {
      return false;
    }
  }
}

export const validator = new Validator();
