export {};

type ThreeRuntime = {
  OrbitControls?: unknown;
  STLLoader?: unknown;
  ThreeMFLoader?: unknown;
  GLTFLoader?: unknown;
};

type Dld3dController = {
  dispose?: () => void;
  resize?: () => void;
};

type Dld3dRuntime = {
  mount: (mountEl: HTMLElement, config: unknown) => Dld3dController;
};

declare global {
  interface Window {
    THREE?: ThreeRuntime;
    JSZip?: unknown;
    fflate?: unknown;
    DLD3DConfigurator?: Dld3dRuntime;
    // Used as a guard to avoid double-starting visuals when navigating between locales.
    __IVO_VISUALS_STARTED__?: boolean;
    dataLayer?: Array<Record<string, string | number | boolean>>;
  }
}
