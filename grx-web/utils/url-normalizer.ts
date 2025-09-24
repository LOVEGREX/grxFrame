// utils/url-normalizer.ts
export function normalized(url: string) { 
    let pathname = url;
    if (!pathname.startsWith('/')) { 
        pathname = '/' + pathname;
    }
    const queryIndex = pathname.indexOf('?');
    if (queryIndex != -1) {
        pathname = pathname.substring(0, queryIndex);
    }
    if (!pathname.endsWith('/')) { 
        pathname = pathname + '/';
    }
    return pathname;
}