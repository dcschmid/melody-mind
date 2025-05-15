/**
 * Benutzerdefinierte WCAG AAA Regeln für ESLint
 * Diese Datei enthält fortgeschrittene Regeln für die Barrierefreiheit nach WCAG AAA-Standard
 */

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Erweiterte WCAG AAA Regeln für optimale Barrierefreiheit",
      category: "Accessibility",
      recommended: true,
    },
  },

  // Benutzerdefinierte Regeln
  rules: {
    // Prüft, ob Bilder ausreichende alt-Texte haben (mindestens 20 Zeichen für informative Bilder)
    "wcag-aaa/informative-alt-text": {
      create: function (context) {
        return {
          JSXOpeningElement(node) {
            if (node.name.name === "img") {
              const altAttr = node.attributes.find((attr) => attr.name && attr.name.name === "alt");

              if (altAttr && altAttr.value && altAttr.value.value) {
                const altText = altAttr.value.value;
                if (altText.length < 20 && altText !== "") {
                  context.report({
                    node,
                    message:
                      "Informativer Alt-Text sollte mindestens 20 Zeichen lang sein für ausreichende Beschreibung (WCAG AAA)",
                  });
                }
              }
            }
          },
        };
      },
    },

    // Prüft auf korrekten Kontrast bei Farbangaben
    "wcag-aaa/color-contrast": {
      create: function (context) {
        const hasWeakContrastColor = (className) => {
          // Liste von Tailwind-Klassen mit potentiell schwachem Kontrast
          const weakContrastClasses = [
            "text-gray-400",
            "text-gray-500",
            "text-red-300",
            "text-yellow-300",
            "bg-white text-gray-300",
            "bg-white text-gray-400",
            "text-purple-300",
            "text-blue-300",
          ];

          return weakContrastClasses.some((cls) => className.includes(cls));
        };

        return {
          JSXAttribute(node) {
            if (node.name.name === "className" || node.name.name === "class") {
              if (typeof node.value.value === "string" && hasWeakContrastColor(node.value.value)) {
                context.report({
                  node,
                  message:
                    "Diese Farbkombination könnte unzureichenden Kontrast haben (WCAG AAA fordert 7:1 für normalen Text)",
                });
              }
            }
          },
        };
      },
    },

    // Prüft auf korrekte ARIA-Attribute
    "wcag-aaa/aria-enhanced": {
      create: function (context) {
        return {
          JSXOpeningElement(node) {
            if (
              node.name.name === "div" &&
              node.attributes.some(
                (attr) => attr.name && attr.name.name === "role" && attr.value.value === "button"
              )
            ) {
              // Prüfe, ob tabindex gesetzt ist
              const hasTabIndex = node.attributes.some(
                (attr) => attr.name && attr.name.name === "tabIndex"
              );

              // Prüfe, ob keydown/keyup Listener vorhanden sind
              const hasKeyHandlers = node.attributes.some(
                (attr) =>
                  attr.name && (attr.name.name === "onKeyDown" || attr.name.name === "onKeyUp")
              );

              if (!hasTabIndex) {
                context.report({
                  node,
                  message:
                    'Elemente mit role="button" benötigen tabIndex="0" für Tastaturfokus (WCAG AAA)',
                });
              }

              if (!hasKeyHandlers) {
                context.report({
                  node,
                  message:
                    'Elemente mit role="button" benötigen onKeyDown/onKeyUp Handler für Enter/Space (WCAG AAA)',
                });
              }
            }
          },
        };
      },
    },

    // Prüft auf optimale Fokus-Verwaltung
    "wcag-aaa/focus-management": {
      create: function (context) {
        return {
          CallExpression(node) {
            if (node.callee.type === "MemberExpression" && node.callee.property.name === "focus") {
              // Suche nach focus() Aufrufen ohne Kontext-Analyse
              context.report({
                node,
                message:
                  "Fokus-Management erfordert Benutzerinitiierung oder explizite Ankündigung (WCAG AAA)",
                suggest: [
                  {
                    desc: "Füge aria-live Ankündigung hinzu",
                    fix: function (fixer) {
                      return fixer.insertTextBefore(
                        node,
                        'announceToScreenReader("Fokus wurde verschoben"); '
                      );
                    },
                  },
                ],
              });
            }
          },
        };
      },
    },

    // Prüft auf semantisch korrekte Überschriften-Struktur
    "wcag-aaa/heading-structure": {
      create: function (context) {
        const headings = [];

        return {
          JSXOpeningElement(node) {
            if (node.name.name && /^h[1-6]$/.test(node.name.name)) {
              const level = parseInt(node.name.name.substring(1));
              headings.push({ node, level });
            }
          },

          "Program:exit": function () {
            // Prüfe, ob Headings in korrekter Reihenfolge sind
            for (let i = 1; i < headings.length; i++) {
              const current = headings[i];
              const previous = headings[i - 1];

              // Es sollte keine Lücken in der Überschriftenhierarchie geben
              if (current.level > previous.level && current.level - previous.level > 1) {
                context.report({
                  node: current.node,
                  message: `Überschriftenhierarchie überspringt Level (von h${previous.level} zu h${current.level}). Dies erschwert die Navigation für Screenreader-Nutzer (WCAG AAA)`,
                });
              }
            }
          },
        };
      },
    },
  },
};
