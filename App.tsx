import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {withAnchorPoint} from 'react-native-anchor-point';

function App(): React.JSX.Element {
  const currentHours = new Date().getHours() - 12;
  const currentMinutes = new Date().getMinutes();
  const currentSeconds = new Date().getSeconds();

  const [currentMinuteHandPosition, setCurrentMinuteHandPosition] = useState(
    currentMinutes / 60,
  );

  const [currentHourHandPosition, setCurrentHourHandPosition] = useState(
    currentHours / 12,
  );

  const minuteHandAnimation = useRef(
    new Animated.Value(currentMinutes / 60),
  ).current;

  const hourHandAnimation = useRef(
    new Animated.Value(currentHours / 12),
  ).current;

  const degreesAnimatedMinuteHand = minuteHandAnimation.interpolate({
    inputRange: [currentMinutes / 60, currentMinutes / 60 + 1],
    outputRange: [
      `${6 * currentMinutes + 0.1 * currentSeconds}deg`,
      `${6 * currentMinutes + 0.1 * currentSeconds + 360}deg`,
    ],
  });

  const degreesAnimatedHourHand = hourHandAnimation.interpolate({
    inputRange: [currentHours / 12, currentHours / 12 + 1],
    outputRange: [
      `${30 * currentHours + 0.5 * currentMinutes}deg`,
      `${30 * currentHours + 0.5 * currentMinutes + 360}deg`,
    ],
  });

  const circleMaxSize = Dimensions.get('screen').width - 100;

  const rotateFromBase = (
    rotateZ: Animated.AnimatedInterpolation<string | number>,
    height: number,
  ) => {
    let transform = {
      transform: [{rotateZ: rotateZ}],
    };
    return withAnchorPoint(transform, {x: 0.5, y: 1}, {width: 4, height});
  };

  const minuteHandZRotation = rotateFromBase(
    degreesAnimatedMinuteHand,
    circleMaxSize / 2 - 8,
  );

  const hourHandZRotation = rotateFromBase(
    degreesAnimatedHourHand,
    circleMaxSize / 2 - 32,
  );

  const scalingStyle = StyleSheet.create({
    circleSize: {
      borderRadius: circleMaxSize,
      width: circleMaxSize,
      height: circleMaxSize,
    },
    hourHand: {
      height: circleMaxSize / 2 - 32,
      left: circleMaxSize / 2 - 2,
    },
    minuteHand: {
      height: circleMaxSize / 2 - 8,
      left: circleMaxSize / 2 - 2,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinuteHandPosition((currentMinuteHandPosition + 1 / 3600) % 1);
      setCurrentHourHandPosition((currentHourHandPosition + 1 / 43200) % 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentHourHandPosition, currentMinuteHandPosition]);

  useEffect(() => {
    Animated.timing(minuteHandAnimation, {
      toValue: currentMinuteHandPosition,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Animated.timing(hourHandAnimation, {
      toValue: currentHourHandPosition,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [
    currentHourHandPosition,
    currentMinuteHandPosition,
    hourHandAnimation,
    minuteHandAnimation,
  ]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.circle, scalingStyle.circleSize]}>
        <Animated.View
          style={[
            styles.staticMinuteHand,
            scalingStyle.minuteHand,
            minuteHandZRotation,
          ]}
        />
        <Animated.View
          style={[
            styles.staticHourHand,
            scalingStyle.hourHand,
            hourHandZRotation,
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#91E5D6FF',
  },
  staticHourHand: {
    top: 32,
    width: 4,
    backgroundColor: '#000000',
    position: 'absolute',
    borderColor: '#91E5D6FF',
  },
  staticMinuteHand: {
    top: 8,
    width: 4,
    backgroundColor: '#787878FF',
    position: 'absolute',
    borderColor: '#91E5D6FF',
  },
});

export default App;
