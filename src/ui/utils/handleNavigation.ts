export const handleNavigation = (shell: Electron.Shell) => (event: Electron.Event, url: string) => {
  if (url.startsWith('https://accounts.townshiptale.com/')) {
    event.preventDefault();
    shell.openExternal(url);
  }
};
