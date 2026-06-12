declare module 'vanilla-tilt' {
  interface TiltOptions {
    max?: number;
    speed?: number;
    glare?: boolean;
    'max-glare'?: number;
    scale?: number;
    perspective?: number;
    axis?: 'x' | 'y' | null;
    reset?: boolean;
    easing?: string;
    transition?: boolean;
    startX?: number;
    startY?: number;
    reverse?: boolean;
    [key: string]: unknown;
  }

  const VanillaTilt: {
    init(elements: HTMLElement | HTMLElement[], options?: TiltOptions): void;
  };

  export default VanillaTilt;
}
