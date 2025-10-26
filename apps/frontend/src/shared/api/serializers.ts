// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeFormData(body: any): FormData {
  const data = new FormData();
  for (const name in body) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    data.append(name, body[name]);
  }
  return data;
}
