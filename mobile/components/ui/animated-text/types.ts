import type { StyleProp, TextStyle } from 'react-native';

export interface AnimationConfig {
  characterDelay: number;
  characterEnterDuration: number;
  characterExitDuration: number;
  layoutTransitionDuration: number;
}

export interface CharacterAnimationParams {
  opacity: number;
  translateY: number;
  scale: number;
  rotate: number;
}

export interface StaggeredTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  animationConfig?: Partial<AnimationConfig>;
  enterFrom?: Partial<CharacterAnimationParams>;
  enterTo?: Partial<CharacterAnimationParams>;
  exitFrom?: Partial<CharacterAnimationParams>;
  exitTo?: Partial<CharacterAnimationParams>;
}

export interface CharacterProps {
  char: string;
  style?: StyleProp<TextStyle>;
  index: number;
  totalChars?: number;
  animationConfig: AnimationConfig;
  enterFrom: CharacterAnimationParams;
  enterTo: CharacterAnimationParams;
  exitFrom: CharacterAnimationParams;
  exitTo: CharacterAnimationParams;
}
