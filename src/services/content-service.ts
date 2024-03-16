export const tagWithContentConfig = [
  "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "body", "button",
  "canvas", "caption", "cite", "code", "colgroup", "data", "datalist", "dd", "del", "details", "dfn",
  "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3",
  "h4", "h5", "h6", "header", "html", "i", "iframe", "ins", "kbd", "label", "legend", "li", "main",
  "map", "mark", "menu", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output",
  "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small",
  "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot",
  "th", "thead", "time", "tr", "u", "ul", "var", "video", "wbr"
];

export const styleOptions = ['font-family', 'font-weight', 'font-size', 'line-height', 'letter-spacing','font-style', 'color']

export async function getStyles(element: any, options: string[]) {
  const styles = window.getComputedStyle(element);
  
  const stylesObj = options.reduce((acc:{[key: string]: string}, option: string) => {
    acc[option] = styles.getPropertyValue(option);
    return acc;
  }, {});

  const familyName = await detectRenderedFont(element);
  
  return {
    ...stylesObj,
    ['render-font-family']: familyName && familyName.replace(/['"]+/g, '') || '', 
    ['render-font-style']: detectFontStyleRender(stylesObj),
  };
};

function detectFontStyleRender(stylesObj: { [key: string]: string }) {
  let fontStyleRender = 'Sans-serif'
  if (stylesObj['font-family']?.includes('serif')) {
    fontStyleRender = 'Serif';
  } 
  if (stylesObj['font-family']?.includes('sans-serif') || stylesObj['font-family']?.includes('ui-sans-serif')) {
    fontStyleRender = 'Sans-serif';
  } 
  return fontStyleRender;
}

async function detectRenderedFont(element: HTMLElement): Promise<string> {
  const getDefaultFonts = async (): Promise<string> => {
    const iframe = document.createElement('iframe') as any;
    const html = '<html><body>';
    let fonts;
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    const subele = iframe.contentWindow.document.createElement(element.tagName);
    iframe.contentWindow.document.body.appendChild(subele);
    fonts = (getComputedStyle(subele) as any)['font-family'];
    document.body.removeChild(iframe);
    return fonts;
  };

  const fonts = `${(getComputedStyle(element) as any)['font-family']},${await getDefaultFonts()}`;
  const fontsArray = fonts.split(',');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d", { willReadFrequently: true }) as any;
  const testString = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()ñ";
  let prevImageData: Uint8ClampedArray | undefined;
  document.body.appendChild(canvas);
  canvas.width = 500;
  canvas.height = 300;
  fontsArray.unshift(`"Font That Doesnt Exists ${Math.random()}"`);

  for (const fontName of fontsArray) {
    const trimmedFontName = fontName.trim();
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx && (ctx.font = `16px ${trimmedFontName}, monospace`);
    ctx?.fillText(testString, 10, 100);
    const idata = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const data = idata?.data || [] as any;
    if (prevImageData) {
      for (let j = 0; j < data.length; j += 3) {
        if (prevImageData[j + 3] !== data[j + 3]) {
          document.body.removeChild(canvas);
          return trimmedFontName;
        }
      }
    }
    prevImageData = data;
  }

  document.body.removeChild(canvas);
  return 'monospace';
}

export function parseRgb(rgb: string) {
  const regex = /\d+/g;
  const matches = rgb.match(regex);
  const r = parseInt(matches?.[0] || '');
  const g = parseInt(matches?.[1] || '');
  const b = parseInt(matches?.[2] || '');
  if (!matches?.length) {
    return ''
  }
  return rgbToHex(r,g,b);
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function createStyleString(details: {[key: string]: string}) {
  return `.selector: {
    font-family: "${details['render-font-family']}",${details['render-font-style']};
    font-weight: ${details['font-weight']};
    font-size: ${details['font-size']};
    line-height: ${details['line-height']};
    letter-spacing: ${details['letter-spacing']};
    font-style: ${details['font-style']};
    color: ${details['color']};
  }`
}
