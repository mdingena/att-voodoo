import { Shell, Event } from 'electron';

export const handleNavigation = (shell: Shell) => (event: Event, url: string): void => {
  if (
    url.startsWith('alta://') ||
    url.startsWith('https://accounts.townshiptale.com/') ||
    url === 'https://discord.gg/THy2AVBPHX' ||
    url === 'https://twitter.com/ubizozo'
  ) {
    event.preventDefault();
    shell.openExternal(url);
  }
};
