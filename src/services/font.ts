const stylesConfig: {[key: string]: string} = {
  100: 'Thin 100',
  '100italic': 'Thin 100 Italic',
  200: 'ExtraLight 200',
  '200italic': 'ExtraLight 200 Italic',
  300: 'Light 300',
  '300italic': 'Light 300 Italic',
  400: 'Regular 400',
  '400italic': 'Regular 400 Italic',
  500: 'Medium 500',
  '500italic': 'Medium 500 Italic',
  600: 'SemiBold 600',
  '600italic': 'SemiBold 600 Italic',
  700: 'Bold 700',
  '700italic': 'Bold 700 Italic',
  800: 'ExtraBold 800',
  '800italic': 'ExtraBold 800 Italic',
  900: 'Black 900',
  '900italic': 'Black 900 Italic',
  'regular': 'Regular 400',
  'italic': 'Thin 100 Italic',
}

export function getFontDetailsConfig(details: any) {
   return {
    ...details,
     links: Object.entries(details.files).map(item => {
      return {
        name: stylesConfig[`${item[0]}`],
        link: item[1]
      }
     })
   }
}

export default {
  getFontDetailsConfig
}