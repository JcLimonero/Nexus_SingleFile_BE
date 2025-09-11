import { CSSValue } from '../interfaces/css-value.type';

export enum VexTheme {
  DEFAULT = 'vex-theme-default',
  TEAL = 'vex-theme-teal',
  BLACK = 'vex-theme-black',
  GREEN = 'vex-theme-green',
  PURPLE = 'vex-theme-purple',
  RED = 'vex-theme-red',
  ORANGE = 'vex-theme-orange',
  
  BLUE = 'vex-theme-blue',
  PINK = 'vex-theme-pink',
  BROWN = 'vex-theme-brown',
  GRAY = 'vex-theme-gray',
  SILVER = 'vex-theme-silver',
  GOLD = 'vex-theme-gold',
  
  LIME = 'vex-theme-lime',
  MAROON = 'vex-theme-maroson',
  NAVY = 'vex-theme-navy',
  OLIVE = 'vex-theme-olive',
  
  VIOLET = 'vex-theme-violet',
  YELLOW = 'vex-theme-yellow'
}

export enum VexConfigName {
  apollo = 'apollo',
  zeus = 'zeus',
  hermes = 'hermes',
  poseidon = 'poseidon',
  ares = 'ares',
  ikaros = 'ikaros'
}

export enum VexColorScheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface VexConfig {
  id: VexConfigName;
  name: string;
  bodyClass: string;
  imgSrc: string;
  direction: 'ltr' | 'rtl';
  style: {
    themeClassName: string;
    colorScheme: VexColorScheme;
    borderRadius: CSSValue;
    button: {
      borderRadius: CSSValue | undefined;
    };
  };
  layout: 'vertical' | 'horizontal';
  boxed: boolean;
  sidenav: {
    title: string;
    imageUrl: string;
    showCollapsePin: boolean;
    user: {
      visible: boolean;
    };
    search: {
      visible: boolean;
    };
    state: 'expanded' | 'collapsed';
  };
  toolbar: {
    fixed: boolean;
    user: {
      visible: boolean;
    };
  };
  navbar: {
    position: 'below-toolbar' | 'in-toolbar';
  };
  footer: {
    visible: boolean;
    fixed: boolean;
  };
}

export type VexConfigs = Record<VexConfigName, VexConfig>;

export interface VexThemeProvider {
  name: string;
  className: string;
}
