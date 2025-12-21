import {useSpring} from '@react-spring/native';
import {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React from 'react';
import {Image, View} from 'react-native';
import EventEmitter from 'eventemitter3';
import {images} from '../../Utils/ImagePath';
import {useColor} from '../../Controller/Color/useColor';
// import {images} from '../../';

const loaderEmitter = new EventEmitter();

export const Loader = ({}) => {
  const [isLoaderOpen, setLoaderState] = useState(false);
  const color = useColor();
  useEffect(() => {
    loaderEmitter.on('loaderState', value => {
      updateLoaderState(value);
    });
    return () => {
      loaderEmitter.removeListener('loaderState', updateLoaderState);
    };
  }, []);

  const updateLoaderState = (
    state: boolean | ((prevState: boolean) => boolean),
  ) => {
    setLoaderState(state);
  };

  const {rotate} = useSpring({
    from: {rotate: 0},
    to: {rotate: 1},
    loop: false,
    config: {duration: 1000},
  });
  return isLoaderOpen ? (
    <View
      style={{
        position: 'absolute',
        width: wp(100),
        height: hp(100),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        opacity: 0.8,
        backgroundColor: color.secondary_101,
      }}>
      <View
        style={{
          // borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: hp(25),
          height: hp(25),
          borderRadius: hp(15),
          // backgroundColor: '#000000',
        }}>
        <Image
          source={images.CloseIcon}
          style={{resizeMode: 'contain', height: hp(25), width: hp(25)}}
        />
      </View>
    </View>
  ) : null;
};

export const loader = {
  open: () => loaderEmitter.emit('loaderState', true),
  close: () => loaderEmitter.emit('loaderState', false),
};
