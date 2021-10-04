import { BrowserWindow } from 'electron';
import { ChildProcess, execFile } from 'child_process';
import config from '../config';

export const startListening = async (
  ui: BrowserWindow | null,
  speech: ChildProcess | null,
  logger: (...args: unknown[]) => void
): Promise<ChildProcess | null> => {
  /* Launch VoodooListener.exe child process. */
  speech = await execFile(config.VOODOO_EXE_PATH, [config.VOODOO_GRAMMAR_PATH]);

  /* Handle Voodoo speech process termination. */
  speech.on('exit', exitCode => {
    logger(`Voodoo speech process terminated with exit code ${exitCode}`);
    ui?.webContents.send('speech-exit', `Voodoo speech process terminated with exit code ${exitCode}`);
  });

  /* Handle Voodoo speech process errors. */
  speech.stderr?.on('data', data => {
    logger(`Voodoo speech process threw an error`, data);
    ui?.webContents.send('speech-error', 'Voodoo speech process threw an error', data);
  });

  /* Handle Voodoo speech recognition. */
  speech.stdout?.on('data', speech => {
    logger('Recognised speech:', speech);
  });

  return speech;
};
