import styles from 'ansi-styles';

export const colorLog = {
  red: (...msg: unknown[]) =>
    console.log(`${styles.red.open}${JSON.stringify(msg)}${styles.red.close}`),
  redBright: (...msg: unknown[]) =>
    console.log(
      `${styles.redBright.open}${JSON.stringify(msg)}${styles.redBright.close}`,
    ),
  bold: (...msg: unknown[]) =>
    console.log(
      `${styles.bold.open}${JSON.stringify(msg)}${styles.bold.close}`,
    ),
  green: (...msg: unknown[]) =>
    console.log(
      `${styles.green.open}${JSON.stringify(msg)}${styles.green.close}`,
    ),
  greenBright: (...msg: unknown[]) =>
    console.log(
      `${styles.greenBright.open}${JSON.stringify(msg)}${
        styles.greenBright.close
      }`,
    ),
  yellow: (...msg: unknown[]) =>
    console.log(
      `${styles.yellow.open}${JSON.stringify(msg)}${styles.yellow.close}`,
    ),
  yellowBright: (...msg: unknown[]) =>
    console.log(
      `${styles.yellowBright.open}${JSON.stringify(msg)}${
        styles.yellowBright.close
      }`,
    ),
  blue: (...msg: unknown[]) =>
    console.log(
      `${styles.blue.open}${JSON.stringify(msg)}${styles.blue.close}`,
    ),
  blueBright: (...msg: unknown[]) =>
    console.log(
      `${styles.blueBright.open}${JSON.stringify(msg)}${
        styles.blueBright.close
      }`,
    ),
  magenta: (...msg: unknown[]) =>
    console.log(
      `${styles.magenta.open}${JSON.stringify(msg)}${styles.magenta.close}`,
    ),
  magentaBright: (...msg: unknown[]) =>
    console.log(
      `${styles.magentaBright.open}${JSON.stringify(msg)}${
        styles.magentaBright.close
      }`,
    ),
  cyan: (...msg: unknown[]) =>
    console.log(
      `${styles.cyan.open}${JSON.stringify(msg)}${styles.cyan.close}`,
    ),
  cyanBright: (...msg: unknown[]) =>
    console.log(
      `${styles.cyanBright.open}${JSON.stringify(msg)}${
        styles.cyanBright.close
      }`,
    ),
};
