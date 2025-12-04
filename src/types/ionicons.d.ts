// TypeScript declarations for Ionicons web components
declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        name?: string;
        size?: 'small' | 'large';
        color?: string;
        src?: string;
      },
      HTMLElement
    >;
  }
}
