

export function isObject( value ) {

    return (typeof value === 'object' && value !== null && !Array.isArray(value))

}

export const groupBy = (values, keyFinder) => {
    // using reduce to aggregate values
    return values.reduce((a, b) => {
      // depending upon the type of keyFinder
      // if it is function, pass the value to it
      // if it is a property, access the property
      const key = typeof keyFinder === 'function' ? keyFinder(b) : b[keyFinder];
      
      // aggregate values based on the keys
      if(!a[key]){
        a[key] = [b];
      }else{
        a[key] = [...a[key], b];
      }
      
      return a;
    }, {});
  };

export const timeDateToDate = (value) => new Date(value).toISOString().split('T')[0];


const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function generateId(): string {
  let newId = '';
  for (let i = 0; i < 20; i++) {
    newId += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return newId;
}


const AlphaNumericUnderscore = /^[a-zA-Z0-9_]+$/;

export function isAlphaNumericUnderscore(value: string): boolean {
  return AlphaNumericUnderscore.test(value);
}


export function objectKeyValuesAreStrings(value: object): value is { [key: string]: string } {
  if (!isObject(value)) {
    return false;
  }

  const entries = Object.entries(value);

  for (let i = 0; i < entries.length; i++) {
    const [key, entryValue] = entries[i];
    if (!isString(key) || !isString(entryValue)) {
      return false;
    }
  }

  return true;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}