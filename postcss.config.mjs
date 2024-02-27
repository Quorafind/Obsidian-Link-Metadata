import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import discard from "postcss-discard";
import prefixSelector from "postcss-prefix-selector";

const prefixList = [
    'div[data-type="markdown"] .cm-link-metadata',
    'div[data-radix-popper-content-wrapper]',
    'div.link-metadata-setting-collapsible',
	'div.link-metadata-theme-setting',
    'span[data-radix-focus-guard]',
    'div[role="dialog"]',
    'div[data-state="open"].dialog-background',
]

const dialogPrefix = ['div[role="dialog"]', 'div[data-state="open"].dialog-background']

function processSelector(selector, lightOrDark) {
    let newSelector = '';
    if(lightOrDark) {
        const tempSelector = selector.replace(lightOrDark, '');
        for(let i = 0; i < prefixList.length; i++) {
            newSelector += lightOrDark + ' ' + prefixList[i] + ' ' + tempSelector + ', ';
        }
        for(let i = 0; i < dialogPrefix.length; i++) {
            newSelector +=  `body${lightOrDark}` + ' > ' + dialogPrefix[i] + (tempSelector.trim().startsWith('.') ? tempSelector : ' ' + tempSelector) + (i === dialogPrefix.length - 1 ? '' : ', ');
        }
    } else {
        for(let i = 0; i < prefixList.length; i++) {
            newSelector += prefixList[i] + ' ' + selector + ', ';
        }
        for(let i = 0; i < dialogPrefix.length; i++) {
            newSelector += 'body > ' + dialogPrefix[i] + (selector.trim().startsWith('.') ? selector : ' ' + selector) + (i === dialogPrefix.length - 1 ? '' : ', ');
        }
    }
    return newSelector;
}

/** @type {import("postcss").Plugin} */
const prefix = prefixSelector({
    prefix: ":is(div[data-type='markdown'] .cm-link-metadata, div.link-metadata-setting-collapsible, div.link-metadata-theme-setting, div[data-radix-popper-content-wrapper], div[role='dialog'], span[data-radix-focus-guard])",
    transform: (prefix, selector, prefixedSelector, _filePath, _rule) => {
        if (selector.includes(".theme-dark") || selector.includes(".lm-theme-dark")) {
            return processSelector(selector, ".theme-dark").replaceAll(".lm-theme-dark", ".theme-dark");
        } else if (selector.includes(".theme-light") || selector.includes(".lm-theme-dark")) {
            return processSelector(selector, ".theme-light").replaceAll(".lm-theme-light", ".theme-light");
        } else if (selector.includes(".cm-link-metadata") || selector.includes(".link-metadata-settings") || selector.includes(".link-metadata-button-container")) {
            return selector;
        } else {
            return processSelector(selector);
        }
    },
});

export default {
    plugins: [
        tailwindcss(),
        autoprefixer({}),
        prefix,
        discard({
            rule: ["html", "body"],
        }),
    ],
};
