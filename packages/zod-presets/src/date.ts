import { z } from "zod";

export const isoDateSchema = z.iso.date();

export const isoDateTimeSchema = z.iso.datetime({ offset: true });
