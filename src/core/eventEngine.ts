export type GameEvent = {
  id: string;
  title: string;
  text: string;
  choices: GameChoice[];
};

export type GameChoice = {
  id: string;
  label: string;
  nextEventId?: string;
};

export function getEventById(events: GameEvent[], eventId: string) {
  return events.find((event) => event.id === eventId);
}
