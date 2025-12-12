export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  spreadRadius: number; // For scattered state
  treeHeight: number;
  treeRadius: number;
  type: 'NEEDLE' | 'ORNAMENT';
}

export interface GeneratedGreeting {
  title: string;
  message: string;
}
