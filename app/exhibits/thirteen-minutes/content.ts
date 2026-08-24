import rawContent from "./content.json";
import type { ExhibitContent } from "./types";

export const thirteenMinutesContent = rawContent satisfies ExhibitContent;

export type ThirteenMinutesSource = {
  readonly title: string;
  readonly label: string;
  readonly publisher: string;
  readonly url: string;
  readonly description: string;
};

export const thirteenMinutesSources = Object.freeze([
  Object.freeze({
    title: "Apollo 11 Air-to-Ground Mission Transcript",
    label: "NASA History ALSJ",
    publisher: "NASA History Apollo Lunar Surface Journal",
    url: "https://www.hq.nasa.gov/alsj/a11/a11.landing.html",
    description: "Complete transcript from powered descent initiation to touchdown at Tranquility Base.",
  }),
  Object.freeze({
    title: "Apollo 11 Guidance Computer (AGC) Source Code",
    label: "MIT Instrumentation Lab",
    publisher: "MIT Instrumentation Laboratory",
    url: "https://github.com/chrislgarry/Apollo-11",
    description: "Original Luminary 1A assembly source code including Hamilton's priority alarm routines.",
  }),
  Object.freeze({
    title: "Margaret Hamilton's Account of the 1202 Alarm",
    label: "Software Pioneers",
    publisher: "NASA History Apollo Lunar Surface Journal",
    url: "https://www.nasa.gov/history/alsj/a11/a11.hamilton.html",
    description: "Firsthand retrospective on asynchronous software engineering and the landing alarms.",
  }),
] satisfies readonly ThirteenMinutesSource[]);
