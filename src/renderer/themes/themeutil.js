import { themes } from "./index";
export const mapTheme = (variables) => {
  return {
    "--color-primary": variables.primary || "",
    "--color-background": variables.background || "",
    "--color-text": variables.text || "",
    "--background-windowBarBackground": variables.windowBarBackground || "",
    "--color-windowBarText": variables.windowBarText || "",
    "--background-SideBarBackground": variables.SideBarBackground || "",
    "--color-SideBarText": variables.SideBarText || "",
    "--color-WindowBarIcon": variables.WindowBarIcon || "",
    "--color-SideBarIconText": variables.SideBarIconText || "",
    "--background-SideBarIconActiveBackground":
      variables.SideBarIconActiveBackground || "",
    "--background-SideBarIconInActiveBackground":
      variables.SideBarIconInActiveBackground || "",
    "--background-MailCardBackground": variables.MailCardBackground || "",
    "--color-MailCardUserIconBackground":
      variables.MailCardUserIconBackground || "",
    "--color-MailCardUserIconText": variables.MailCardUserIconText || "",
    "--color-MailCardTime": variables.MailCardTime || "",
    "--color-MailCardSenderText": variables.MailCardSenderText || "",
    "--color-MailCardStarredIcon": variables.MailCardStarredIcon || "",
    "--color-MailCardMessageTruncated":
      variables.MailCardMessageTruncated || "",
    "--background-MailCardReadButtonBackground":
      variables.MailCardReadButtonBackground || "",
    "--color-MailCardReadButtonText": variables.MailCardReadButtonText || "",
    "--color-MailCardUnreadIcon": variables.MailCardUnreadIcon || "",
    "--color-MailCardSenderName": variables.MailCardSenderName || "",
    "--color-RightIntroName": variables.RightIntroName || "",
    "--color-RightIntroDescription": variables.RightIntroDescription || "",
    "--color-StatCardBackground": variables.StatCardBackground || "",
    "--color-StatCardText": variables.StatCardText || "",
    "--background-BannerCardBackground": variables.BannerCardBackground || "",
    "--color-BannerCardText": variables.BannerCardText || "",
    "--background-BannerCardButtonBackground":
      variables.BannerCardButtonBackground || "",
    "--color-BannerCardButtonText": variables.BannerCardButtonText || "",
    "--color-BannerCardTitle": variables.BannerCardTitle || "",
    "--background-SettingsButtonBackground": variables.SettingsButtonBackground || "",
    "--color-SettingsCardText": variables.SettingsCardText || "",
    "--background-SettingsButtonBackground":
      variables.SettingsButtonBackground || "",
    "--color-SettingsCardButtonText": variables.SettingsCardButtonText || "",
    "--color-SettingsCardTitle": variables.SettingsCardTitle || "",
    "--background-searchBackground": variables.searchBackground || "",
    "--color-searchText": variables.searchText || "",
    "--color-SearchIcons": variables.SearchIcons || "",
    "--color-UserEmailText": variables.UserEmailText || "",
    "--color-LoadingText": variables.LoadingText || "",
    "--background-LoadingBackground": variables.LoadingBackground || "",
    "--color-LoadingIcon": variables.LoadingIcon || "",
    "--background-DisplayMailTopIconBackground":
      variables.DisplayMailTopIconBackground || "",
    "--color-DisplayMailTopIcon": variables.DisplayMailTopIcon || "",
    "--background-DisplayMailUserIconBackground":
      variables.DisplayMailUserIconBackground || "",
    "--color-DisplayMailTopIcon": variables.DisplayMailTopIcon || "",
    "--background-DisplayMailUserIconBackground":
      variables.DisplayMailUserIconBackground || "",
    "--color-DisplayMailUserIcon": variables.DisplayMailUserIcon || "",
    "--color-DisplayMailToolTip": variables.DisplayMailToolTip || "",
    "--color-DisplayMailSenderIcon": variables.DisplayMailSenderIcon || "",
  };
};

export const applyTheme = (theme, email) => {
  const themeObject = mapTheme(themes(email)[theme] && themes(email)[theme]);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === "name") {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};

export const extend = (extending, newTheme) => {
  return { ...extending, ...newTheme };
};
