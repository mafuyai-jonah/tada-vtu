// @ts-ignore
import React, { useMemo, memo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
} from "react-native-reanimated";
import { SHADER_SOURCE, DEFAULTS } from "./conf";
import { colorToRGBA } from "./helper";
import type { ILiquidMetal, RGBA } from "./types";

const IS_WEB = Platform.OS === "web";

let _shader: any = null;
let _initAttempted = false;

function getShader(): any {
  if (_shader) return _shader;
  if (_initAttempted) return null;
  _initAttempted = true;
  try {
    const Skia = require("@shopify/react-native-skia").Skia;
    if (!Skia?.RuntimeEffect) return null;
    _shader = Skia.RuntimeEffect.Make(SHADER_SOURCE);
    return _shader;
  } catch {
    return null;
  }
}

function useShader() {
  const [shader, setShader] = require("react").useState(() => getShader());
  require("react").useEffect(() => {
    if (shader) return;
    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      const s = getShader();
      if (s) {
        setShader(s);
        clearInterval(interval);
      } else if (retries > 10) {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return shader;
}

export const LiquidMetal: React.FC<ILiquidMetal> = memo(
  ({
    width = DEFAULTS.WIDTH,
    height = DEFAULTS.HEIGHT,
    borderRadius = DEFAULTS.BORDER_RADIUS,
    highlightColor = DEFAULTS.HIGHLIGHT,
    shadowColor = DEFAULTS.SHADOW,
    density = DEFAULTS.DENSITY,
    rate = DEFAULTS.RATE,
    split = DEFAULTS.SPLIT,
    turbulence = DEFAULTS.TURBULENCE,
    crispness = DEFAULTS.CRISPNESS,
    tilt = DEFAULTS.TILT,
    pulsate = DEFAULTS.PULSATE,
    halo = DEFAULTS.HALO,
    asChild = false,
    children,
    style,
  }) => {
    const shader = useShader();

    const tick = useSharedValue<number>(0);
    useFrameCallback(() => {
      tick.value += 0.016 * rate;
    });

    const light = useMemo<RGBA>(
      () => colorToRGBA(highlightColor),
      [highlightColor],
    );
    const dark = useMemo<RGBA>(
      () => colorToRGBA(shadowColor),
      [shadowColor],
    );

    const uniforms = useDerivedValue(() => ({
      uDimensions: [width, height] as [number, number],
      uTick: tick.value,
      uLight: light as [number, number, number, number],
      uDark: dark as [number, number, number, number],
      uDensity: density,
      uRate: rate,
      uSplit: split,
      uTurbulence: turbulence,
      uCrispness: crispness,
      uTilt: tilt,
      uPulsate: pulsate,
      uHalo: halo,
    }));

    if (!shader) {
      if (asChild) {
        return (
          <View
            style={[
              styles.wrapper,
              { width, height, borderRadius },
              style,
            ]}
          >
            <View style={[styles.content, { borderRadius }]}>
              {children}
            </View>
          </View>
        );
      }
      return (
        <View
          style={[
            styles.wrapper,
            { width, height, borderRadius, backgroundColor: "#E8E8E8" },
            style,
          ]}
        />
      );
    }

    const { Canvas, Fill, Shader: SkiaShader } =
      require("@shopify/react-native-skia");

    const shaderContent = (
      <Canvas style={[StyleSheet.absoluteFill, { borderRadius }]}>
        <Fill>
          <SkiaShader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    );

    if (asChild) {
      return (
        <View
          style={[styles.wrapper, { width, height, borderRadius }, style]}
        >
          {shaderContent}
          <View style={[styles.content, { borderRadius }]}>{children}</View>
        </View>
      );
    }

    return (
      <View
        style={[styles.wrapper, { width, height, borderRadius }, style]}
      >
        {shaderContent}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

LiquidMetal.displayName = "LiquidMetal";

export type { ILiquidMetal, RGBA } from "./types";
export default LiquidMetal;
