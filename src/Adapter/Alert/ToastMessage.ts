import Toast from 'react-native-simple-toast';

class ToastMessages {
  private position = {
    top: Toast.TOP,
    bottom: Toast.BOTTOM,
    center: Toast.CENTER,
  };
  private time = {
    short: Toast.SHORT,
    long: Toast.LONG,
  };
  private style = {backgroundColor: 'black', textColor: 'white'};

  TOAST_LONG_TOP(text: string): void {
    Toast.showWithGravity(text, this.time.long, this.position.top, this.style);
  }
  TOAST_LONG_BOTTOM(text: string): void {
    Toast.showWithGravity(
      text,
      this.time.long,
      this.position.bottom,
      this.style,
    );
  }
  TOAST_LONG_CENTER(text: string): void {
    Toast.showWithGravity(
      text,
      this.time.long,
      this.position.center,
      this.style,
    );
  }
  TOAST_SHORT_TOP(text: string): void {
    Toast.showWithGravity(text, this.time.short, this.position.top, this.style);
  }
  TOAST_SHORT_BOTTOM(text: string): void {
    Toast.showWithGravity(
      text,
      this.time.short,
      this.position.bottom,
      this.style,
    );
  }
  TOAST_SHORT_CENTER(text: string): void {
    Toast.showWithGravity(
      text,
      this.time.short,
      this.position.center,
      this.style,
    );
  }
}

export const ToastMessage = new ToastMessages();
