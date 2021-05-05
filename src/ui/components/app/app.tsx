import { ipcRenderer } from 'electron';
import { Routes } from '@/routes';

ipcRenderer.on('speechExit', (_, reason) => {
  console.log(reason);
});

ipcRenderer.on('speechError', (_, reason, error) => {
  console.log(reason, error);
});

ipcRenderer.on('speechData', (_, recognisedSpeech) => {
  console.log({ recognisedSpeech });
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
