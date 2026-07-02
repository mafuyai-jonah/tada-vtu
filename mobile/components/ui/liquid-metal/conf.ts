export const DEFAULTS = {
  WIDTH: 300,
  HEIGHT: 300,
  BORDER_RADIUS: 24,
  HIGHLIGHT: "#E8E8E8",
  SHADOW: "#8A8A8A",
  DENSITY: 1.2,
  RATE: 1.0,
  SPLIT: 0.5,
  TURBULENCE: 0.4,
  CRISPNESS: 0.8,
  TILT: 0.3,
  PULSATE: 0.2,
  HALO: 0.6,
};

export const SHADER_SOURCE = `
uniform float2 uDimensions;
uniform float uTick;
uniform float4 uLight;
uniform float4 uDark;
uniform float uDensity;
uniform float uRate;
uniform float uSplit;
uniform float uTurbulence;
uniform float uCrispness;
uniform float uTilt;
uniform float uPulsate;
uniform float uHalo;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 5; i++) {
    f += w * snoise(p);
    p *= 2.0;
    w *= 0.5;
  }
  return f;
}

float4 main(float2 fragCoord) {
  float2 uv = fragCoord / uDimensions;
  float t = uTick;

  vec2 q = uv;

  float n1 = fbm(q * uDensity * 3.0 + vec2(t * 0.1, t * 0.07));
  float n2 = fbm(q * uDensity * 3.0 + vec2(t * 0.13, t * 0.09) + n1 * uTurbulence);
  float n3 = fbm(q * uDensity * 2.0 + vec2(t * 0.05, t * 0.11) + n2 * uTurbulence * 0.5);

  float displacement = n3 * uSplit;

  vec2 distorted = q + vec2(displacement * 0.3, displacement * 0.2);

  float highlight = smoothstep(0.3, 0.8, n1) * uCrispness;
  float shadow = smoothstep(0.7, 0.2, n2) * (1.0 - uCrispness) * 0.5;

  float tiltEffect = (uv.y - 0.5) * uTilt;
  highlight += tiltEffect;
  shadow -= tiltEffect * 0.3;

  float pulse = sin(t * 2.0) * uPulsate;
  highlight += pulse;

  vec4 baseColor = mix(uDark, uLight, clamp(highlight + shadow + 0.5, 0.0, 1.0));

  float specular = pow(max(0.0, n1 * 2.0 - 0.5), 3.0) * 0.6;
  baseColor.rgb += specular;

  float edge = smoothstep(0.0, 0.05, uv.x) * smoothstep(0.0, 0.05, uv.y) *
               smoothstep(0.0, 0.05, 1.0 - uv.x) * smoothstep(0.0, 0.05, 1.0 - uv.y);
  baseColor.rgb *= edge;

  float haloGlow = (1.0 - length((uv - 0.5) * 2.0)) * uHalo * 0.15;
  baseColor.rgb += haloGlow;

  return baseColor;
}
`;
