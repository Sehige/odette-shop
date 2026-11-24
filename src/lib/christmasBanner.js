import { christmas } from '../data/christmas';
import { romaniaDate } from './openingHours';

/** Whether the homepage opens with the Christmas banner: until the last day to order, in Romania */
export const christmasBannerOn = (now = new Date()) => romaniaDate(now) <= christmas.bannerUntil;
