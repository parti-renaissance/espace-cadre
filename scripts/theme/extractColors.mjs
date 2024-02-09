import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Obtenez le chemin du répertoire courant en utilisant import.meta.url
const currentDir = path.dirname(fileURLToPath(import.meta.url))

// Chemin du fichier JSON relatif au script
const jsonFilePath = path.join(currentDir, 'figma-colors.json')

// Fonction pour convertir les valeurs RGBA en code couleur hexadécimal
function rgbaToHex({ r, g, b, a }) {
  return (
    '#' +
    [r, g, b]
      .map(x =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('') +
    Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
  )
}

// Fonction pour mapper les noms de couleur
function mapColorName(name) {
  const mappings = {
    Clair: 'light',
    'Très Clair': 'lighter',
    '100%': 'main', // Assumant que "100%" est utilisé pour la couleur principale
    Foncé: 'dark',
    'Très Foncé': 'darker',
    'contrast-text': 'contrastText',
  }
  return mappings[name] || name
}

// Fonction pour extraire et organiser les couleurs
function extractColors() {
  const rawData = fs.readFileSync(jsonFilePath)
  const colorsJson = JSON.parse(rawData)

  const colorFamilies = {}

  colorsJson.variables.forEach(variable => {
    const rgbaColor = variable.resolvedValuesByMode['5:4'].resolvedValue
    const hexColor = rgbaToHex(rgbaColor)
    const nameParts = variable.name.split('/')
    const colorFamily = nameParts[0].toLowerCase()
    const colorName = mapColorName(nameParts[1])

    if (!colorFamilies[colorFamily]) {
      colorFamilies[colorFamily] = {}
    }

    colorFamilies[colorFamily][colorName] = hexColor
  })

  let colorsContent = ''

  Object.keys(colorFamilies).forEach(family => {
    colorsContent += `export const ${family} = {\n`
    Object.keys(colorFamilies[family]).forEach(key => {
      colorsContent += `  ${key}: '${colorFamilies[family][key]}',\n`
    })
    colorsContent += '}\n\n'
  })

  // Chemin du fichier de sortie
  const outputPath = path.join(currentDir, 'generated-colors.ts')

  // Ecriture dans un fichier TypeScript
  fs.writeFileSync(outputPath, colorsContent)
}

// Exécution de la fonction
extractColors()
