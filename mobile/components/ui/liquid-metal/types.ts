export interface ILiquidMetal {
  width?: number;
  height?: number;
  borderRadius?: number;
  highlightColor?: string;
  shadowColor?: string;
  density?: number;
  rate?: number;
  split?: number;
  turbulence?: number;
  crispness?: number;
  tilt?: number;
  pulsate?: number;
  halo?: number;
  asChild?: boolean;
  children?: React.ReactNode;
  style?: any;
}

export type RGBA = [number, number, number, number];
