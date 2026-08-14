import styles from "../thirteen-minutes.module.css";

const segmentMap: Record<string, string[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "d", "e", "g"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["b", "c", "f", "g"],
  "5": ["a", "c", "d", "f", "g"],
  "6": ["a", "c", "d", "e", "f", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  ":": ["colon"],
};

const allSegments = ["a", "b", "c", "d", "e", "f", "g"];

export function segmentsForCharacter(character: string) {
  return segmentMap[character] ?? [];
}

export function SevenSegmentValue({ value }: { value: string }) {
  return (
    <span aria-label={value} className={styles.segmentValue} data-segment-display>
      {Array.from(value).map((character, index) => {
        const activeSegments = segmentsForCharacter(character);
        if (activeSegments.includes("colon")) {
          return <i aria-hidden="true" className={styles.segmentColon} key={`${character}-${index}`} />;
        }
        if (activeSegments.length > 0) {
          return (
            <i
              aria-hidden="true"
              className={styles.segmentDigit}
              data-character={character}
              key={`${character}-${index}`}
            >
              {allSegments.map((segment) => (
                <b
                  className={styles.segment}
                  data-active={String(activeSegments.includes(segment))}
                  data-segment={segment}
                  key={segment}
                />
              ))}
            </i>
          );
        }
        return (
          <i aria-hidden="true" className={styles.segmentSymbol} key={`${character}-${index}`}>
            {character === " " ? "\u00a0" : character}
          </i>
        );
      })}
    </span>
  );
}
