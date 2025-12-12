import { Vector3 } from 'three';

export const COLORS = {
  EMERALD_DARK: '#064e3b', // emerald-900
  EMERALD_LIGHT: '#10b981', // emerald-500
  GOLD_METALLIC: '#facc15', // yellow-400
  GOLD_SHIMMER: '#fffbeb', // amber-50
  BG_DARK: '#020617',
};

export const SCENE_CONFIG = {
  NEEDLE_COUNT: 2500,
  ORNAMENT_COUNT: 150,
  SCATTER_RADIUS: 35,
  TREE_HEIGHT: 18,
  TREE_BASE_RADIUS: 6,
  ANIMATION_SPEED: 2.5, // Speed of interpolation
};

// Camera init position
export const INITIAL_CAMERA_POS = new Vector3(0, 5, 25);
