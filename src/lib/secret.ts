export async function hashSecretId(loginId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(loginId);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

export function makeRandomSecretString(length: number): string {
  const secret = [
    '비',
    '밀',
    '은',
    ' ',
    '정',
    '당',
    '한',
    ' ',
    '방',
    '법',
    '으',
    '로',
    ' ',
    '확',
    '인',
    '하',
    '세',
    '요',
    ' ',
    '^^',
  ];
  let returnString = '';
  let index = 0;
  while (returnString.length < length) {
    if (index >= secret.length) index = 0;
    returnString += secret[index];
    index++;
  }
  return returnString;
}
