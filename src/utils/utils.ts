import { SourceMapConsumer } from 'source-map-js';

export const decodeErrorStack = async (stack: string, mapUrl: string): Promise<string> => {
  const response = await fetch(mapUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch source map: ${response.statusText}`);
  }
  const rawSourceMap = await response.json();
  const consumer = await new SourceMapConsumer(rawSourceMap);

  const decodedStack = stack
    .split('\n')
    .map(line => {
      const match = /(.+):(\d+):(\d+)/.exec(line);
      if (!match) return line;

      const [, file, lineNum, colNum] = match;
      console.log(file);

      const originalPosition = consumer.originalPositionFor({
        line: parseInt(lineNum, 10),
        column: parseInt(colNum, 10),
      });

      if (originalPosition.source) {
        return `${originalPosition.source}:${originalPosition.line}:${originalPosition.column} - ${originalPosition.name || ''}`;
      }
      return line;
    })
    .join('\n');

  //consumer.destroy(); // Libera recursos
  return decodedStack;
}

export const extractMapUrl = (stack: string): string | null => {
  const match = stack.match(/http:\/\/localhost\:3000\/assets\/(.+\.js)/);
  return match ? `http://localhost:3000/assets/${match[1]}.map` : null;
}
