interface Feed {
    title: string;
    code: string;
    length: string;
    order: number;
}

interface Config {
    url: string;
}

export { Feed, Config };