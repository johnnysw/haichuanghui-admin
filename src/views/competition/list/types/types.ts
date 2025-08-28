import type { Competition } from "@/types/competition";

export type FormItemProps = Competition.CompetitionForm;

export type CompetitionItem = Competition.CompetitionInfo;

export type CompetitionListResponse = {
  list: CompetitionItem[];
  total: number;
  page: number;
  limit: number;
};