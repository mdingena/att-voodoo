import { ipcRenderer } from 'electron';
import { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { appStageAtom, AppStage, serversAtom, Servers, activeServerAtom, speechModeAtom, SpeechMode } from '@/atoms';
import styles from './ServersScreen.module.css';

interface LauncherLinkProps {
  groupId: number;
}

export type ServersUpdate = {
  playerJoined: number | null;
  servers: Servers;
};

let intervalHandle: number | undefined;

const LauncherLink: React.FC<LauncherLinkProps> = ({ groupId, children }) => {
  if (groupId === 0) return <>{children}</>;

  return <a href={`alta://social/group/${groupId}`}>{children}</a>;
};

export const ServersScreen = (): JSX.Element => {
  const [timeLeft, setTimeLeft] = useState(-3);
  const [servers, setServers] = useAtom(serversAtom);
  const [, setActiveServer] = useAtom(activeServerAtom);
  const [, setAppStage] = useAtom(appStageAtom);
  const [, setSpeechMode] = useAtom(speechModeAtom);

  const handleUpdateServers = useCallback(
    (_: Event, { playerJoined, servers: updatedServers }: ServersUpdate) => {
      setServers(updatedServers);

      if (playerJoined) {
        setActiveServer(playerJoined);
        ipcRenderer.invoke('server-connected');
        setAppStage(AppStage.Connected);
      }
    },
    [setServers, setActiveServer, setAppStage]
  );

  const handleVoodooSuppressed = useCallback(() => {
    setSpeechMode(SpeechMode.Suppressed);
  }, [setSpeechMode]);

  useEffect(() => {
    ipcRenderer.invoke('server-disconnected');
    ipcRenderer.on('update-servers', handleUpdateServers);
    ipcRenderer.on('voodoo-suppressed', handleVoodooSuppressed);

    return () => {
      ipcRenderer.removeListener('update-server', handleUpdateServers);
      ipcRenderer.removeListener('voodoo-suppressed', handleVoodooSuppressed);
    };
  }, [handleUpdateServers, handleVoodooSuppressed]);

  useEffect(() => {
    setTimeLeft(t => Math.min(15, t + 15));

    intervalHandle = window.setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 980);

    return () => {
      clearInterval(intervalHandle);
    };
  }, [servers]);

  const timer = timeLeft ? `${timeLeft}s` : <>refreshing&hellip;</>;

  return (
    <div className={styles.root}>
      <span className={styles.message}>Waiting for server&hellip;</span>
      <small className={styles.instructions}>
        <br />
        Voodoo will automatically connect to the same server you join in-game if that server supports Voodoo.
        <br />
        <br />
        Click a server to open in launcher
      </small>
      <br />

      <table className={styles.servers} cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th align='left'>Voodoo Servers ({timer})</th>
            <th align='right'>
              <abbr title='Players online'>#</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {servers.length ? (
            servers
              .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
              .sort((a, b) => b.players - a.players)
              .sort((a, b) => Number(b.online) - Number(a.online))
              .map((server, index) => (
                <tr key={index} className={!server.online ? styles.offline : undefined}>
                  <td align='left'>
                    <LauncherLink groupId={server.groupId}>{server.name}</LauncherLink>
                  </td>
                  <td align='right'>{server.players}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td className={styles.noServers} colSpan={2}>
                No servers online
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
