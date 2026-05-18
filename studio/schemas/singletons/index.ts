export { siteSettings } from "./siteSettings";
export { navigation } from "./navigation";
export { contactInfo } from "./contactInfo";
export { homePage } from "./homePage";

/**
 * Liste centralisée des types singletons.
 * Utilisée par `structure.ts` pour les épingler et empêcher la création de doublons.
 */
export const SINGLETON_TYPES = ["siteSettings", "navigation", "contactInfo", "homePage"] as const;
export type SingletonType = (typeof SINGLETON_TYPES)[number];
