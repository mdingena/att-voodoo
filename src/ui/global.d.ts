declare module '*.css';
declare module '*.png';
declare module '*.wav' {
  const src: string;
  export default src;
}
