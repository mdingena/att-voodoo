export const findDeepLinkUrl = (deeplink: string[]) => deeplink.find(arg => arg.startsWith('att-voodoo://'));
