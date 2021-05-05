import { Shell, Event } from 'electron';

export const handleNavigation = (shell: Shell) => (event: Event, url: string) => {
  if (url.startsWith('https://accounts.townshiptale.com/')) {
    event.preventDefault();
    shell.openExternal(url);
  }
};
