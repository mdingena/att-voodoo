import { useCallback, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { appStageAtom, AppStage, activeServerAtom } from '@/atoms';
import { ServersUpdate } from '@/components/ServersScreen';

export const Dashboard = () => {
  const [appStage, setAppStage] = useAtom(appStageAtom);
  const [activeServer] = useAtom(activeServerAtom);

  const handleUpdateServers = useCallback(
    (_: Event, { playerJoined }: ServersUpdate) => {
      if (playerJoined !== activeServer) setAppStage(AppStage.WaitingForServer);
    },
    [activeServer]
  );

  useEffect(() => {
    ipcRenderer.on('update-servers', handleUpdateServers);

    return () => {
      ipcRenderer.removeListener('update-server', handleUpdateServers);
    };
  }, []);

  return <></>;
};
