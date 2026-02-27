export interface AppLayoutConfig {
  layout: 'vertical' | 'horizontal';
  boxed: boolean;
  toolbar: { fixed: boolean; user: { visible: boolean } };
  sidenav: {
    title: string;
    showCollapsePin: boolean;
    user: { visible: boolean };
    search: { visible: boolean };
  };
  navbar: { position: 'in-toolbar' | 'below-toolbar' };
  footer: { visible: boolean; fixed: boolean };
}

export const DEFAULT_LAYOUT_CONFIG: AppLayoutConfig = {
  layout: 'horizontal',
  boxed: false,
  toolbar: { fixed: true, user: { visible: true } },
  sidenav: {
    title: 'NexFile One',
    showCollapsePin: true,
    user: { visible: true },
    search: { visible: true }
  },
  navbar: { position: 'in-toolbar' },
  footer: { visible: true, fixed: true }
};
