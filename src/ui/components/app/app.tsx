import { ipcRenderer } from 'electron';
import { Routes } from '@/routes';

ipcRenderer.on('exePath', (_, data) => {
  console.log({ data });
});

ipcRenderer.on('speechExit', (_, { exitCode }) => {
  console.log({ exitCode });
});

ipcRenderer.on('speechError', (_, { error }) => {
  console.log({ error });
});

ipcRenderer.on('speechData', (_, { data }) => {
  console.log({ data });
});

export const App = () => {
  return (
    <>
      <div className='app'>
        <h1>I'm React running in Electron App!!</h1>
      </div>
      <Routes />
    </>
  );
};
