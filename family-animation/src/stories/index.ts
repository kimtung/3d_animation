import type { StoryTimeline } from "@engine/timeline/TimelineEvent.ts";
import story1Data from "./story1_dad_tv_secret.json";
import story2Data from "./story2_family_movie_night.json";

export interface StoryInfo {
  id: string;
  title: string;
  description: string;
  duration: number;
  data: StoryTimeline;
}

export const STORIES: StoryInfo[] = [
  {
    id: "dad_tv_secret",
    title: "Tập 1: Bố trốn việc nhà xem TV",
    description: "Bố định xem trộm trận bóng đá, ai ngờ bị Mẹ và hai con phục kích sẵn!",
    duration: 36,
    data: story1Data as unknown as StoryTimeline,
  },
  {
    id: "family_movie_night",
    title: "Tập 2: Cuối tuần xem phim gia đình",
    description: "Hai con tranh nhau xem siêu nhân và công chúa, Bố thể hiện bản lĩnh trọng tài tuyệt đỉnh!",
    duration: 30,
    data: story2Data as unknown as StoryTimeline,
  },
];
