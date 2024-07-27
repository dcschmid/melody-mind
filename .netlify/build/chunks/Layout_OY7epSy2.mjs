import { c as createComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes, d as addAttribute, a as renderComponent, b as createAstro, u as unescapeHTML, F as Fragment, e as renderHead, f as renderSlot } from './astro/server_BCx95_ce.mjs';
import 'kleur/colors';
import { getIconData, iconToSVG } from '@iconify/utils';
/* empty css                            */

const icons = {"local":{"prefix":"local","lastModified":1722058322,"icons":{"clock":{"body":"<path fill=\"currentColor\" d=\"M18.665 5.09a1.94 1.94 0 0 0 0 3.88h1.942v2.3C13.4 12.826 8 19.237 8 26.91c0 8.836 7.163 16 16 16s16-7.164 16-16c0-8.013-5.889-14.65-13.574-15.818V8.97h1.936a1.94 1.94 0 1 0 0-3.88h-9.697ZM36.12 26.91c0 6.694-5.427 12.12-12.121 12.12-6.694 0-12.121-5.426-12.121-12.12 0-6.695 5.427-12.122 12.121-12.122 6.694 0 12.121 5.427 12.121 12.121Zm-10.666-6.79a1.455 1.455 0 0 0-2.909 0v7.758a1.455 1.455 0 0 0 1.952 1.367l5.333-1.94a1.455 1.455 0 0 0-.994-2.734l-3.382 1.23v-5.68Z\"/>","width":48,"height":48},"cover-shuffle-logo":{"body":"<g fill=\"none\"><g clip-path=\"url(#a)\"><path fill=\"#676766\" d=\"M15.13 42.216c-.049-.321-.036-.68-.181-.95-.295-.549-.605-1.126-1.042-1.555-.96-.94-2.025-1.77-3-2.693-.449-.425-.889-.912-1.16-1.457-.433-.866-.143-1.704.416-2.47.166-.058.34-.137.523-.183.932-.232 1.455.083 1.698 1.02.088.336.17.673.273 1.084.807-.4 1.633-.583 2.32-1.094a4.694 4.694 0 0 0-.819-2.334c-.444-.646-1.101-.987-1.875-1.056a5.58 5.58 0 0 0-1.316.015c-1.287.192-2.482.63-3.17 1.821-.804 1.394-1.019 2.888-.46 4.442.528 1.372 1.548 2.281 2.803 2.966l.007.006c.228.225.444.466.689.672.757.64 1.446 1.327 1.836 2.261.047.38.141.759.132 1.136-.022.899-.577 1.441-1.476 1.523-.237.022-.471.081-.762.133-1.2-.522-1.216-1.707-1.39-2.894l-2.393.617-.057.774c.2.514.342.862.468 1.216.268.746.698 1.37 1.38 1.788 1.51.929 3.087.96 4.628.154 1.552-.811 1.97-2.297 2.07-3.913.006-.103-.045-.209-.059-.315-.032-.238-.05-.477-.086-.715h.003Zm56.684-8.413 4.303-.503v-2.334l-4.339.43V26.93c.127-.028.23-.06.335-.07 1.34-.148 2.678-.3 4.019-.431.307-.03.609-.015.768-.348v-2.005c-1.365-.06-2.621.194-3.882.342-1.252.145-2.523.197-3.71.489v5.444c0 1.786.001 3.571.004 5.358.002 1.773-.026 3.545.006 5.37 1.395-.15 2.677-.302 3.962-.421 1.09-.102 2.185-.151 3.275-.254.281-.026.551-.164.817-.249v-2.417l-5.556.549v-4.484h-.002Zm-.687-19.133 2.885 5.836 3.526-.433c-.123-.283-.197-.483-.293-.672-.554-1.068-1.087-2.149-1.682-3.193-.452-.796-1.803-1.954-.346-2.505.222-.2.516-.388.698-.652.258-.376.573-.794.618-1.22.12-1.1.153-2.216.129-3.325-.013-.561-.155-1.144-.358-1.673-.227-.586-.633-1.094-1.245-1.348a3.992 3.992 0 0 0-2.002-.278c-2.512.27-5.028.496-7.543.728-.262.024-.494.038-.55.354l.027.172.005.303.007.195.025 5.555c-.02.134-.058.27-.06.404-.008 2.715-.013 5.429-.013 8.144 0 .127.05.255.09.45.902-.08 1.77-.152 2.64-.24.267-.026.531-.096.902-.166l-.108-2.132-.016-3.914.146-.188c.842-.07 1.682-.137 2.518-.205v.003Zm-2.655-5.938c1.283-.1 2.536-.227 3.79-.281.675-.028 1.05.37 1.158 1.045.185 1.155-.357 1.933-1.509 2.09-1.114.152-2.235.253-3.439.386v-3.24Zm-6.23 12.934a82.74 82.74 0 0 0-.016-3.09c-2.617.143-5.101.568-7.657.715v-3.492l5.913-.632c.148-.89.104-2.315-.078-2.873l-5.862.58v-2.758c2.375-.248 4.714-.491 7.105-.742 0-.581.018-1.072-.005-1.562-.023-.479.1-.973-.085-1.448L51.25 7.417v15.227c.786.219 8.905-.531 10.992-.977v-.001Zm-18.988-7.571c-.472 1.95-.931 3.903-1.396 5.856-.21-.145-.288-.278-.328-.422-.454-1.65-.891-3.303-1.352-4.95-.389-1.39-.787-2.779-1.216-4.157-.158-.51-.216-1.078-.726-1.574l-3.462.273.232.725c.948 2.92 1.895 5.84 2.844 8.759.33 1.014.666 2.026.998 3.038.104.868.447 1.656.754 2.47.21-.04.34-.064.47-.09 1.304-.164 2.608-.327 3.959-.499 1.595-5.25 3.117-10.462 4.53-15.794-1.327.147-2.574.285-3.85.428-.494 2.005-.983 3.97-1.46 5.938l.003-.001ZM26.688 30.539l.055-1.42-2.552.278v7.238c-1.087.113-2.114.221-3.141.324-.234.023-.47.026-.792.043v-7.19c-.894.113-1.695.212-2.506.313v10.299c0 1.893-.007 3.785.004 5.678 0 .192.1.385.154.577l.535-.039 1.83-.205v-6.913c1.381-.32 2.657-.548 3.992-.575v2.486c-.001.795-.02 1.593-.004 2.388.017.777-.09 1.56.06 2.302.837-.143 1.605-.274 2.427-.416 0-.795.003-1.558 0-2.32-.017-4.283-.03-8.565-.06-12.847l-.002-.001Zm8.714-2.315c-.053.192-.15.384-.15.577-.004 3.343.003 6.688.016 10.031 0 .27.05.541.076.811-.028.629-.013 1.262-.09 1.885-.16 1.268-1.793 1.987-2.848 1.272a1.342 1.342 0 0 1-.613-1.023 13.53 13.53 0 0 1-.035-1.065c-.01-3.668-.016-7.335-.023-11.002l.001-.183-.008-.301v-.205l.012-.307c-.243-.35-.527-.146-.802-.06-.406.039-.815.054-1.215.125-.188.033-.359.169-.537.258l.025.18c.016 3.457.027 6.914.05 10.37.01 1.257.045 2.513.067 3.646.344.5.535.965.878 1.244 1.606 1.305 4.847 1.032 6.327-.468.881-.894 1.228-1.968 1.23-3.2.004-4.116.028-8.232.04-12.347 0-.152-.041-.305-.072-.52l-2.328.282Zm14.35 5.089v2.8c.005 2.307.009 4.612.016 6.92 0 .023.019.048.036.067.018.02.041.036.105.087.746-.08 1.529-.164 2.39-.259v-7.067l4.547-.55c.018-.821.032-1.545-.02-2.284l-4.429.476-.1-.216c.003-.74-.002-1.48.011-2.22.014-.754-.047-1.514.052-2.27l5.072-.564v-2.326l-7.678.82v6.584l-.002.002Zm-9.51-1.985c-.017.107-.046.215-.046.323-.007 4.108-.011 8.214-.013 12.32 0 .123.049.246.085.422.182-.074.303-.12.423-.17l2.098-.163c0-1.265-.007-2.467.002-3.671.008-1.223-.028-2.448.008-3.687l4.358-.544v-2.247l-4.275.43v-4.51c.877-.103 1.7-.165 2.512-.301.822-.137 1.69-.043 2.467-.39V26.9l-7.618.82v3.609l-.002-.002Zm21.85-5.962c-.924.116-1.759.22-2.553.321v16.414l7.808-.812v-2.523l-5.255.55V25.368Zm-44.026-3.864a.48.48 0 0 0-.004-.225l-3.367.41c-.14 1.494-.604 2.154-1.745 2.487-.667.196-1.353.245-2.038.082-.616-.147-1.024-.518-1.157-1.147-.05-.24-.076-.49-.078-.735-.005-1.813-.01-3.627.006-5.44.003-.38.062-.768.15-1.139.143-.611.571-1.056 1.148-1.187a9.822 9.822 0 0 1 2.285-.235c.847.01 1.26.485 1.373 1.336.02.154.076.303.124.49l1.668-.2c.535-.065 1.072-.133 1.682-.208-.073-.61-.105-1.13-.203-1.636-.262-1.346-.942-2.475-2.9-2.784-1.971-.31-3.888.065-5.767.627-1.813.542-2.812 1.847-2.872 3.688-.087 2.741-.008 5.488 0 8.234.071 1.118.46 2.059 1.473 2.657.553.223 1.089.513 1.663.654 1.117.274 2.255.118 3.359-.091.937-.177 1.888-.423 2.751-.818 1.663-.76 2.362-2.19 2.465-3.926l-.014-.894h-.002Zm2.995 1.049c.34 1.639 1.331 2.594 2.99 2.865 1.995.326 3.943.066 5.836-.591 1.773-.614 2.818-1.845 2.975-3.754.03-.356.054-.712.057-1.069.009-.932.003-1.865.003-2.798h.003c0-.933.016-1.865-.006-2.798-.012-.547-.045-1.1-.142-1.637-.345-1.914-1.211-2.706-3.205-3.005-1.803-.27-3.622.007-5.376.503-1.263.355-2.262 1.097-2.836 2.326-.356.763-.448 1.58-.458 2.4-.024 2.085-.017 4.17 0 6.255.003.434.07.876.159 1.302v.001Zm3.323-8.41c1.032-1.498 2.518-1.385 3.974-1.26.53.046.851.483.956 1.007.075.375.12.761.125 1.142 0 0 .095 4.118-.003 4.853-.06.446-.141.91-.296 1.337a1.508 1.508 0 0 1-1.128.988c-.72.139-1.467.228-2.195.197-.824-.036-1.265-.536-1.404-1.36a3.307 3.307 0 0 1-.042-.572c.011-2.029.028-4.058.04-6.085 0-.082-.016-.163-.026-.246h-.001Z\"/><path fill=\"#fff\" d=\"M64.271 5.739c.024.038.051.074.067.116.004.011-.027.037-.04.055l-.027-.171ZM14.438 41.662c-.049-.32-.036-.68-.181-.95-.295-.548-.605-1.126-1.043-1.555-.959-.94-2.024-1.77-3-2.692-.448-.425-.888-.912-1.16-1.458-.433-.866-.142-1.703.417-2.47.166-.058.34-.137.523-.182.932-.233 1.455.083 1.698 1.02.088.336.17.672.273 1.083.807-.4 1.633-.583 2.32-1.093a4.693 4.693 0 0 0-.819-2.335c-.444-.646-1.101-.986-1.875-1.056a5.574 5.574 0 0 0-1.316.015c-1.287.193-2.482.63-3.17 1.822-.804 1.393-1.019 2.888-.46 4.442.528 1.371 1.548 2.28 2.803 2.965l.007.006c.228.226.444.466.689.673.757.639 1.446 1.327 1.836 2.26.047.38.141.76.132 1.137-.023.898-.578 1.44-1.476 1.522-.238.022-.471.082-.762.133-1.2-.522-1.217-1.706-1.39-2.894-.828.215-1.612.417-2.394.617l-.056.774c.199.515.341.862.467 1.217.269.745.7 1.37 1.38 1.787 1.51.929 3.088.96 4.63.154 1.55-.81 1.968-2.297 2.068-3.912.007-.104-.044-.21-.058-.316-.032-.238-.05-.477-.086-.715l.003.001Zm56.684-8.412c1.46-.17 2.871-.336 4.302-.504v-2.333l-4.338.43v-4.467c.127-.027.23-.06.335-.07 1.34-.147 2.678-.3 4.019-.43.307-.031.609-.016.768-.348v-2.005c-1.365-.06-2.621.194-3.882.342-1.252.145-2.523.196-3.71.488v5.444c0 1.787.001 3.572.004 5.359.001 1.772-.026 3.545.005 5.37 1.395-.15 2.678-.303 3.963-.422 1.09-.1 2.185-.15 3.275-.253.281-.026.55-.165.817-.25v-2.417l-5.557.55V33.25h-.001Z\"/><path fill=\"#fff\" d=\"m70.434 14.117 2.886 5.835 3.526-.433c-.123-.282-.197-.483-.294-.67-.553-1.07-1.086-2.15-1.68-3.195-.453-.796-1.804-1.954-.347-2.505.221-.2.516-.387.698-.651.258-.377.573-.795.618-1.22a25.8 25.8 0 0 0 .129-3.325c-.013-.562-.155-1.144-.359-1.673-.227-.587-.632-1.095-1.244-1.348a3.992 3.992 0 0 0-2.002-.278c-2.512.27-5.028.495-7.543.728-.262.023-.495.037-.55.354l.026.172.006.303.007.195.025 5.555c-.021.134-.058.27-.06.404-.008 2.715-.013 5.429-.013 8.144 0 .127.05.254.09.45.902-.08 1.77-.153 2.64-.24.267-.026.531-.097.902-.166l-.108-2.133a2552 2552 0 0 0-.017-3.913l.147-.188c.842-.07 1.682-.137 2.517-.205v.003ZM67.78 8.179c1.283-.1 2.535-.227 3.79-.281.675-.028 1.05.37 1.158 1.045.185 1.155-.357 1.933-1.509 2.09-1.114.151-2.235.252-3.439.385v-3.24Zm-6.23 12.933c.01-1.003.013-2.025-.017-3.09-2.616.144-5.1.569-7.656.715v-3.491l5.913-.633c.148-.89.104-2.315-.078-2.872-1.933.19-3.865.382-5.862.58v-2.76c2.375-.247 4.714-.49 7.105-.741 0-.582.018-1.073-.005-1.563-.023-.479.1-.973-.085-1.447-3.47.354-6.903.704-10.307 1.053V22.09c.786.219 8.905-.531 10.992-.977v-.001Zm-18.988-7.571c-.472 1.95-.931 3.904-1.396 5.857-.21-.146-.288-.279-.328-.423-.454-1.65-.891-3.303-1.352-4.95a154.35 154.35 0 0 0-1.217-4.157c-.157-.509-.216-1.078-.725-1.573l-3.462.272c.1.31.164.518.232.726.948 2.92 1.895 5.84 2.844 8.758.33 1.014.666 2.026.998 3.039.104.868.447 1.655.754 2.47l.47-.09c1.304-.165 2.608-.328 3.958-.5 1.596-5.25 3.118-10.461 4.531-15.793-1.327.146-2.574.285-3.85.427-.494 2.005-.984 3.97-1.46 5.938l.003-.001ZM25.996 29.985l.055-1.42-2.552.279v7.237c-1.088.114-2.114.222-3.141.324-.234.024-.47.026-.792.043v-7.19l-2.506.314V39.87c0 1.893-.007 3.785.004 5.678 0 .193.1.385.154.577l.535-.038 1.83-.205v-6.914c1.38-.32 2.657-.548 3.992-.574v2.485c-.001.796-.02 1.593-.004 2.389.017.776-.09 1.56.06 2.301l2.427-.415c0-.796.003-1.558 0-2.32-.017-4.284-.03-8.565-.061-12.847l-.002-.002Zm8.714-2.315c-.053.192-.15.385-.15.577-.004 3.344.003 6.688.016 10.032 0 .27.05.54.076.81-.028.629-.013 1.263-.09 1.886-.16 1.267-1.794 1.987-2.848 1.271a1.342 1.342 0 0 1-.613-1.022c-.03-.355-.033-.712-.035-1.066a14942.72 14942.72 0 0 1-.022-11.184l-.008-.302v-.205l.012-.307c-.243-.35-.527-.145-.802-.06-.406.04-.816.054-1.215.125-.189.033-.359.169-.537.259l.025.18c.016 3.457.027 6.913.05 10.37.01 1.257.045 2.512.067 3.645.343.5.534.965.878 1.244 1.606 1.305 4.847 1.033 6.326-.467.882-.894 1.23-1.968 1.23-3.201.005-4.116.029-8.231.04-12.347 0-.152-.04-.304-.071-.52l-2.328.282h-.001Zm14.35 5.09v2.8l.015 6.919c0 .023.02.048.036.068.019.02.042.036.106.087l2.39-.259v-7.067a3943.7 3943.7 0 0 0 4.547-.551c.018-.82.032-1.544-.02-2.283-1.537.164-2.983.32-4.43.476l-.099-.216c.003-.74-.003-1.481.011-2.22.014-.754-.047-1.514.051-2.27l5.072-.564v-2.326l-7.677.82v6.583l-.002.003Zm-9.51-1.986c-.017.108-.046.216-.046.324-.007 4.107-.011 8.213-.013 12.32 0 .122.049.245.085.421l.423-.169 2.098-.163c0-1.265-.007-2.467.001-3.671.009-1.224-.027-2.448.009-3.687l4.358-.544v-2.247l-4.275.429v-4.51c.877-.103 1.7-.165 2.511-.3.822-.137 1.69-.043 2.468-.39v-2.241l-7.618.82v3.61l-.002-.002Zm21.85-5.961-2.553.32v16.415l7.808-.813v-2.523l-5.255.551v-13.95Zm-44.026-3.864a.481.481 0 0 0-.004-.226l-3.367.411c-.14 1.494-.604 2.154-1.745 2.487-.667.195-1.353.245-2.038.082-.616-.147-1.024-.518-1.157-1.148a3.772 3.772 0 0 1-.078-.734c-.005-1.813-.01-3.627.006-5.44.003-.38.062-.768.15-1.14.143-.61.57-1.055 1.148-1.186a9.827 9.827 0 0 1 2.285-.236c.847.011 1.259.486 1.373 1.337.02.154.076.303.124.49l1.668-.2c.535-.066 1.072-.134 1.682-.208-.073-.61-.105-1.13-.203-1.636-.262-1.347-.942-2.476-2.9-2.784-1.971-.31-3.888.065-5.767.627-1.813.542-2.812 1.847-2.872 3.688-.087 2.741-.008 5.488 0 8.234.07 1.118.46 2.059 1.473 2.656.553.223 1.089.514 1.663.655 1.117.274 2.254.118 3.359-.091.937-.177 1.887-.424 2.75-.818 1.664-.76 2.363-2.19 2.466-3.926l-.014-.894h-.002Zm2.995 1.049c.34 1.638 1.331 2.593 2.989 2.864 1.995.327 3.944.067 5.837-.59 1.773-.615 2.818-1.845 2.975-3.755.03-.355.054-.711.057-1.068.008-.933.003-1.866.003-2.798h.003c0-.933.016-1.866-.006-2.798-.012-.547-.045-1.1-.142-1.637-.345-1.914-1.211-2.706-3.205-3.005-1.804-.27-3.622.007-5.377.502-1.262.356-2.26 1.098-2.835 2.327-.356.762-.449 1.58-.458 2.4a317.996 317.996 0 0 0 0 6.254c.002.435.07.876.159 1.303Zm3.323-8.41c1.032-1.498 2.518-1.385 3.974-1.26.53.045.851.482.956 1.007.075.375.12.761.125 1.142 0 0 .095 4.118-.003 4.853-.06.446-.141.91-.296 1.337a1.508 1.508 0 0 1-1.128.988c-.72.138-1.467.228-2.195.196-.825-.036-1.265-.535-1.404-1.359a3.307 3.307 0 0 1-.042-.573c.011-2.028.028-4.057.04-6.084 0-.082-.016-.164-.026-.247h-.002Z\"/><path fill=\"#fff\" d=\"m41.654 59.229-10.772-9.104-23.28 2.323h-.054C3.385 52.448 0 49.062 0 44.901V14.328c0-4.143 3.354-7.517 7.49-7.547L75.429 0h1.025C80.615 0 84 3.386 84 7.548v30.57c0 4.144-3.355 7.517-7.49 7.548L58.121 47.88 41.654 59.228v.001ZM31.419 47.845l10.517 6.62 14.767-9.142.255-.025 18.47-1.844h.056a5.34 5.34 0 0 0 5.333-5.333V7.548a5.339 5.339 0 0 0-5.28-5.334L7.602 8.995h-.055a5.34 5.34 0 0 0-5.334 5.333V44.9a5.339 5.339 0 0 0 5.281 5.334l23.924-2.389v.001Z\"/></g><defs><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h84v59.229H0z\"/></clipPath></defs></g>","width":84,"height":60},"next":{"body":"<path fill=\"#1A0E38\" d=\"M6 11.05h9.09l-3.74-3.61L12.74 6 19 12.05l-6.26 6.05-1.39-1.43 3.74-3.62H6v-2Z\"/>"},"question":{"body":"<path fill=\"#AEAEAE\" fill-rule=\"evenodd\" d=\"M24 11.63c0 6.191-5.372 11.21-12 11.21-6.627 0-12-5.019-12-11.21C0 5.44 5.373.42 12 .42c6.628 0 12 5.02 12 11.21ZM9.857 8.828c0-1.106.96-2.002 2.143-2.002 1.184 0 2.143.896 2.143 2.002 0 1.105-.96 2.002-2.143 2.002-.71 0-1.286.537-1.286 1.2v1.036c0 .663.576 1.201 1.286 1.201.71 0 1.286-.538 1.286-1.201 1.979-.523 3.429-2.222 3.429-4.238 0-2.433-2.111-4.404-4.715-4.404-2.603 0-4.714 1.971-4.714 4.404 0 .663.576 1.2 1.286 1.2.71 0 1.285-.537 1.285-1.2Zm3.858 8.407c0 .885-.768 1.602-1.715 1.602-.947 0-1.714-.717-1.714-1.602 0-.884.768-1.601 1.714-1.601.947 0 1.714.717 1.714 1.601Z\" clip-rule=\"evenodd\"/>","height":23},"settings":{"body":"<path fill=\"#AEAEAE\" fill-rule=\"evenodd\" d=\"M2.664.25A2.304 2.304 0 0 0 .361 2.554v16.893a2.304 2.304 0 0 0 2.303 2.303h16.893a2.304 2.304 0 0 0 2.304-2.303V2.553A2.304 2.304 0 0 0 19.557.25H2.664Zm3.648 9.038v7.855a.96.96 0 0 0 1.92 0V9.288a2.689 2.689 0 1 0-1.92 0Zm11.326 2.864a2.689 2.689 0 0 1-1.728 2.51v2.48a.96.96 0 1 1-1.92 0v-2.48a2.689 2.689 0 0 1 0-5.021V4.857a.96.96 0 1 1 1.92 0v4.784a2.689 2.689 0 0 1 1.728 2.51Z\" clip-rule=\"evenodd\"/>","width":22,"height":22},"spotify":{"body":"<path fill=\"currentColor\" d=\"M12 2C6.476 2 2 6.476 2 12s4.476 10 10 10 10-4.476 10-10S17.524 2 12 2Zm4.588 14.424a.62.62 0 0 1-.856.208c-2.348-1.436-5.304-1.76-8.784-.964A.626.626 0 0 1 6.2 15.2a.626.626 0 0 1 .468-.748c3.808-.872 7.076-.496 9.712 1.116.292.18.388.564.208.856Zm1.224-2.724a.776.776 0 0 1-1.072.256c-2.688-1.652-6.784-2.132-9.964-1.164a.78.78 0 0 1-.452-1.492c3.632-1.104 8.148-.568 11.232 1.328.368.224.48.704.256 1.072Zm.104-2.836C14.692 8.948 9.376 8.772 6.3 9.708a.937.937 0 0 1-.544-1.792c3.532-1.072 9.404-.864 13.116 1.336a.934.934 0 1 1-.952 1.608l-.004.004Z\"/>"},"user":{"body":"<path fill=\"#AEAEAE\" fill-rule=\"evenodd\" d=\"M24.11 12a11.96 11.96 0 0 1-3.327 8.294A11.965 11.965 0 0 1 12.147 24h-.072a11.965 11.965 0 0 1-8.637-3.706A11.96 11.96 0 0 1 .111 12c0-6.627 5.372-12 12-12 6.627 0 12 5.373 12 12Zm-4.726 6a9.409 9.409 0 0 0-7.273-3.429A9.41 9.41 0 0 0 4.837 18a9.41 9.41 0 0 0 7.274 3.429A9.41 9.41 0 0 0 19.384 18Zm-7.273-5.143a4.286 4.286 0 1 0 0-8.571 4.286 4.286 0 0 0 0 8.571Z\" clip-rule=\"evenodd\"/>","width":25}},"width":24,"height":24}};
const config = {"include":{}};

const cache = /* @__PURE__ */ new WeakMap();

const $$Astro$1 = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
    }
  }
  const req = Astro2.request;
  const { name = "", title, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const { include = {} } = config;
  const sets = Object.keys(include);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    {
      err.hint = `The provided value of "${name}" is invalid.

Did you forget the icon set name? If you were attemping to reference a local icon, use the icon's name directly. (ie. "${iconName}")`;
    }
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      {
        err.hint = 'It looks like the "local" set was not loaded.\n\nDid you forget to create the icon directory or to update your config?';
      }
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      {
        err.hint = `The icon named "${iconName}" was not found in your local icon directory.

Did you forget to configure your icon directory or make a typo?`;
      }
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    {
      if (sets.includes(setName)) {
        err.hint = `It looks like the "${setName}" set was not loaded.

Did you install the "@iconify-json/${setName}" dependency?`;
      } else {
        err.hint = `It looks like the "${setName}" set is not included in your configuration.

Do you need to add the "${setName}" set?`;
      }
    }
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    {
      const [maybeStar] = include[setName];
      if (maybeStar === "*" || include[setName].includes(iconName)) {
        err.hint = `The "${setName}" set does not include an icon named "${iconName}".

Is this a typo?`;
      } else {
        err.hint = `The "${setName}" set is not configured to include an icon named "${iconName}".

Do you need to add it to your configuration?`;
      }
    }
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "xlink:href")}></use> ` })}`} </svg>`;
}, "/Users/danielschmid/projects/cover-shuffle/node_modules/astro-icon/components/Icon.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <div data-astro-cid-3ef6ksr2>${renderComponent($$result, "Icon", $$Icon, { "name": "question", "width": 24, "height": 22.24, "data-astro-cid-3ef6ksr2": true })}</div> <div data-astro-cid-3ef6ksr2> <a href="/gamehome" data-astro-cid-3ef6ksr2>${renderComponent($$result, "Icon", $$Icon, { "name": "cover-shuffle-logo", "width": 84, "height": 59.229, "data-astro-cid-3ef6ksr2": true })}</a> </div> <div class="iconGroup" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "Icon", $$Icon, { "name": "settings", "width": 24, "height": 22.24, "data-astro-cid-3ef6ksr2": true })} <a href="/user" data-astro-cid-3ef6ksr2>${renderComponent($$result, "Icon", $$Icon, { "name": "user", "width": 24, "height": 22.24, "data-astro-cid-3ef6ksr2": true })}</a> </div> </header> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Header.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="de"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} <main> ${renderSlot($$result, $$slots["default"])} </main>  </body></html>`;
}, "/Users/danielschmid/projects/cover-shuffle/src/layouts/Layout.astro", void 0);

export { $$Layout as $, $$Icon as a };