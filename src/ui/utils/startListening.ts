import { BrowserWindow } from 'electron';
import { ChildProcess, execFile } from 'child_process';
import { handleSpeech } from './handleSpeech';
import config from '../config';

export const startListening = async (
  ui: BrowserWindow | null,
  speech: ChildProcess | null,
  accessToken: string,
  logger: (...args: any) => void
): Promise<void> => {
  /* Launch VoodooListener.exe child process. */
  speech = await execFile(config.VOODOO_EXE_PATH, [config.VOODOO_GRAMMAR_PATH]);

  /* Handle Voodoo speech process termination. */
  speech.on('exit', exitCode => {
    logger(`Voodoo speech process terminated with exit code ${exitCode}`);
    ui?.webContents.send('speechExit', `Voodoo speech process terminated with exit code ${exitCode}`);
  });

  /* Handle Voodoo speech process errors. */
  speech.stderr?.on('data', data => {
    logger(`Voodoo speech process threw an error`, data);
    ui?.webContents.send('speechError', 'Voodoo speech process threw an error', data);
  });

  /* Handle Voodoo speech recognition. */
  speech.stdout?.on('data', data => {
    handleSpeech(data, accessToken, logger);
    logger(`Voodoo speech recognised`, data);
    ui?.webContents.send('speechData', data);
  });
};
