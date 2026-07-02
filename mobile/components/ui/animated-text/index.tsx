import { View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  withTiming,
  withDelay,
  Easing,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type {
  StaggeredTextProps,
  AnimationConfig,
  CharacterAnimationParams,
} from './types';
import {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_ENTER_FROM,
  DEFAULT_ENTER_TO,
} from './conf';

const Character = ({ char, style, index, animationConfig, enterFrom, enterTo }: {
  char: string;
  style: any;
  index: number;
  animationConfig: AnimationConfig;
  enterFrom: CharacterAnimationParams;
  enterTo: CharacterAnimationParams;
}) => {
  const enterDelay = index * animationConfig.characterDelay;

  const opacity = useSharedValue(enterFrom.opacity);
  const translateY = useSharedValue(enterFrom.translateY);
  const scale = useSharedValue(enterFrom.scale);

  useEffect(() => {
    const config = {
      duration: animationConfig.characterEnterDuration,
      easing: Easing.out(Easing.ease),
    };
    opacity.value = withDelay(enterDelay, withTiming(enterTo.opacity, config));
    translateY.value = withDelay(enterDelay, withTiming(enterTo.translateY, config));
    scale.value = withDelay(enterDelay, withTiming(enterTo.scale, config));
  }, [enterDelay, enterTo, animationConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.Text style={[style, animatedStyle]}>{char}</Animated.Text>
  );
};

export const AnimatedText = ({ text, style, animationConfig, enterFrom, enterTo }: StaggeredTextProps) => {
  const characters = Array.from(text);

  const config: AnimationConfig = {
    ...DEFAULT_ANIMATION_CONFIG,
    ...animationConfig,
  };

  const from: CharacterAnimationParams = { ...DEFAULT_ENTER_FROM, ...enterFrom };
  const to: CharacterAnimationParams = { ...DEFAULT_ENTER_TO, ...enterTo };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {characters.map((char, i) => (
        <Character
          key={`${i}`}
          char={char}
          style={style}
          index={i}
          animationConfig={config}
          enterFrom={from}
          enterTo={to}
        />
      ))}
    </View>
  );
};
