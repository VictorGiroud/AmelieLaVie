const TZ = "Europe/Paris";

export const dateLong = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: TZ,
});

export const dateFull = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: TZ,
});

export const dateLongNoTime = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: TZ,
});

export const dateFullNoTime = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeZone: TZ,
});

export const dateShort = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: TZ,
});
