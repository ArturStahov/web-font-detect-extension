export function debounce(func: any, timeout = 200) {
  let timer: any = 0;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export default {
  debounce,
}