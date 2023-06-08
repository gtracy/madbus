import React, { useEffect, useState } from "react";

import IconButton from '@mui/material/IconButton';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import { Typography } from "@mui/material";

import { gaEvents } from '../analytics';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  useEffect(() => {
    const checkInstallationStatus = () => {
      const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
      setIsInstalled(isInstalled);
    };

    window.addEventListener("appinstalled", checkInstallationStatus);
    checkInstallationStatus();

    return () => window.removeEventListener("appinstalled", checkInstallationStatus);
  }, []);

  const onClick = evt => {
    gaEvents.buttonClick("app install");

    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  if (!supportsPWA || isInstalled) {
    return null;
  }

  return (
    <IconButton color="secondary" onClick={onClick}>
        <Typography variant="caption">install app</Typography>
        <InstallMobileIcon/>
    </IconButton>
  );
};

export default InstallPWA;
